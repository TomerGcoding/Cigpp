import { AppState } from 'react-native';
import LocalCigaretteStore from './LocalCigaretteStore';
import cigaretteLogService from './CigaretteLogService';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.syncInterval = null;
    this.retryQueue = new Map();
    this.maxRetries = 3;
    this.baseRetryDelay = 1000; // 1 second
    this.syncIntervalTime = 5 * 60 * 1000; // 5 minutes
    this.listeners = new Set();
    this.isOnline = true;
    this.lastFullSyncTime = null;
    this.fullSyncInterval = 30 * 60 * 1000; // 30 minutes for full sync
    
    this.initializeNetworkListener();
    this.initializeAppStateListener();
  }

  // Initialize network status listener
  initializeNetworkListener() {
    // Check connectivity every 30 seconds
    this.networkCheckInterval = setInterval(async () => {
      const wasOffline = !this.isOnline;
      this.isOnline = await this.checkConnectivity();
      
      if (wasOffline && this.isOnline) {
        // Just came back online, trigger immediate sync
        this.notifyListeners('network_restored');
        this.notifyListeners('should_sync_now');
      } else if (!this.isOnline && !wasOffline) {
        this.notifyListeners('network_lost');
      }
    }, 30000);

    // Initial connectivity check
    this.checkConnectivity().then(isConnected => {
      this.isOnline = isConnected;
    });
  }

  // Simple connectivity check using fetch
  async checkConnectivity() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Initialize app state listener
  initializeAppStateListener() {
    AppState.addEventListener('change', (nextAppState) => {
      this.onAppStateChange(nextAppState);
    });
  }

  // Add listener for sync events
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of sync events
  notifyListeners(event, data = null) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in SyncManager listener:', error);
      }
    });
  }

  // Start automatic sync
  startAutoSync() {
    if (this.syncInterval) {
      this.stopAutoSync();
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.notifyListeners('should_sync_now');
      }
    }, this.syncIntervalTime);

    // Initial sync will be triggered by the coordinator
  }

  // Stop automatic sync
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Perform immediate sync
  async syncNow(userId) {
    if (!this.isOnline || this.isSyncing) {
      return;
    }

    if (!userId) {
      console.warn('SyncManager: Cannot sync without userId');
      return;
    }

    this.isSyncing = true;
    this.notifyListeners('sync_started');

    try {
      // Step 1: Push local changes to server
      await this.pushLocalChanges();
      
      // Step 2: Check if full sync is needed
      const shouldFullSync = await this.shouldPerformFullSync();
      if (shouldFullSync) {
        await this.performFullSync(userId);
      }
      
      await LocalCigaretteStore.updateLastSyncTimestamp();
      this.notifyListeners('sync_completed');
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.notifyListeners('sync_failed', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Push local pending changes to server
  async pushLocalChanges() {
    const unsyncedLogs = await LocalCigaretteStore.getUnsyncedLogs();
    
    for (const log of unsyncedLogs) {
      await this.syncSingleLog(log);
    }
  }

  // Sync a single log with retry mechanism
  async syncSingleLog(log) {
    const retryKey = log.localId;
    const retryCount = this.retryQueue.get(retryKey) || 0;

    try {
      if (log.syncStatus === 'deleted_pending') {
        // Handle deletion
        if (log.serverId) {
          await cigaretteLogService.deleteCigaretteLog(log.serverId);
        }
        // Remove from local storage completely
        await LocalCigaretteStore.removeLogCompletely(log.localId);
        
      } else if (log.syncStatus === 'pending' || log.syncStatus === 'failed') {
        // Handle creation or update
        const serverLog = await cigaretteLogService.addCigaretteLog({
          userId: log.userId,
          description: log.description,
          timestamp: log.timestamp
        });
        
        // Update local log with server ID and sync status
        await LocalCigaretteStore.updateLogSyncStatus(
          log.localId, 
          'synced', 
          serverLog.id
        );
      }

      // Remove from retry queue on success
      this.retryQueue.delete(retryKey);
      this.notifyListeners('log_synced', log);
      
    } catch (error) {
      console.error(`Failed to sync log ${log.localId}:`, error);
      
      if (retryCount < this.maxRetries) {
        // Add to retry queue with exponential backoff
        this.retryQueue.set(retryKey, retryCount + 1);
        const delay = this.baseRetryDelay * Math.pow(2, retryCount);
        
        setTimeout(() => {
          if (this.retryQueue.has(retryKey)) {
            this.syncSingleLog(log);
          }
        }, delay);
        
        // Mark as failed but don't give up yet
        await LocalCigaretteStore.updateLogSyncStatus(log.localId, 'failed');
      } else {
        // Max retries reached, mark as permanently failed
        await LocalCigaretteStore.updateLogSyncStatus(log.localId, 'failed');
        this.retryQueue.delete(retryKey);
        this.notifyListeners('log_sync_failed', { log, error });
      }
    }
  }

  // Check if full sync is needed
  async shouldPerformFullSync() {
    const now = Date.now();
    
    // Full sync if never done before
    if (!this.lastFullSyncTime) {
      return true;
    }
    
    // Full sync if enough time has passed
    if (now - this.lastFullSyncTime > this.fullSyncInterval) {
      return true;
    }
    
    // Full sync if we have conflicting data
    const unsyncedLogs = await LocalCigaretteStore.getUnsyncedLogs();
    const hasFailedLogs = unsyncedLogs.some(log => log.syncStatus === 'failed');
    
    return hasFailedLogs;
  }

  // Perform full synchronization with server
  async performFullSync(userId) {
    if (!userId) {
      console.error('Cannot perform full sync without userId');
      return;
    }

    try {
      this.notifyListeners('full_sync_started');
      
      // Get server data for today (and potentially recent days)
      const serverLogs = await cigaretteLogService.getTodayLogs(userId);
      
      // Merge with local data
      await LocalCigaretteStore.mergeServerData(serverLogs);
      
      this.lastFullSyncTime = Date.now();
      this.notifyListeners('full_sync_completed');
      
    } catch (error) {
      console.error('Full sync failed:', error);
      this.notifyListeners('full_sync_failed', error);
      throw error;
    }
  }

  // Force full sync manually
  async forceFullSync(userId) {
    this.lastFullSyncTime = null;
    await this.performFullSync(userId);
  }

  // Get sync status information
  async getSyncStatus() {
    const stats = await LocalCigaretteStore.getSyncStats();
    const lastSync = await LocalCigaretteStore.getLastSyncTimestamp();
    const retryQueueSize = this.retryQueue.size;
    
    return {
      isSyncing: this.isSyncing,
      isOnline: this.isOnline,
      lastSyncTime: lastSync,
      retryQueueSize,
      stats,
      nextAutoSync: this.syncInterval ? 
        new Date(Date.now() + this.syncIntervalTime) : null
    };
  }

  // Handle app state changes
  onAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      // App became active, trigger sync if we have a user
      if (this.isOnline && !this.isSyncing) {
        // Note: We need userId for sync, this will be provided by the coordinator
        this.notifyListeners('app_became_active');
      }
      this.startAutoSync();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App going to background, stop auto sync to save battery
      this.stopAutoSync();
    }
  }

  // Clear retry queue (useful for testing or manual intervention)
  clearRetryQueue() {
    this.retryQueue.clear();
    this.notifyListeners('retry_queue_cleared');
  }

  // Get retry queue status
  getRetryQueueStatus() {
    return Array.from(this.retryQueue.entries()).map(([localId, retryCount]) => ({
      localId,
      retryCount,
      maxRetries: this.maxRetries
    }));
  }

  // Handle conflict resolution (simple strategy: server wins)
  async resolveConflict(localLog, serverLog) {
    try {
      // Simple strategy: server timestamp wins
      if (new Date(serverLog.timestamp) >= new Date(localLog.timestamp)) {
        // Server version is newer or same, update local
        await LocalCigaretteStore.updateLogSyncStatus(
          localLog.localId,
          'synced',
          serverLog.id
        );
        return 'server_wins';
      } else {
        // Local version is newer, push to server
        await this.syncSingleLog(localLog);
        return 'local_wins';
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
      throw error;
    }
  }

  // Manual sync trigger for UI buttons
  async triggerManualSync(userId) {
    if (!userId) {
      this.notifyListeners('sync_failed', new Error('No user ID provided'));
      return;
    }

    if (this.isSyncing) {
      return; // Already syncing
    }

    if (!this.isOnline) {
      this.notifyListeners('sync_failed', new Error('Device is offline'));
      return;
    }

    await this.syncNow(userId);
  }

  // Get network status
  async getNetworkStatus() {
    const isConnected = await this.checkConnectivity();
    return {
      isConnected,
      type: 'unknown',
      isWifiEnabled: null,
      strength: null
    };
  }

  // Cleanup method for proper teardown
  cleanup() {
    this.stopAutoSync();
    if (this.networkCheckInterval) {
      clearInterval(this.networkCheckInterval);
      this.networkCheckInterval = null;
    }
    this.clearRetryQueue();
    this.listeners.clear();
  }
}

export default new SyncManager();