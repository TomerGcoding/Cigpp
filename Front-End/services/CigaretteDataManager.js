import LocalCigaretteStore from './LocalCigaretteStore';
import SyncManager from './SyncManager';

class CigaretteDataManager {
  constructor() {
    this.listeners = new Set();
    this.currentUserId = null;
    this.isInitialized = false;
    
    this.initializeListeners();
  }

  // Initialize listeners from LocalStore and SyncManager
  initializeListeners() {
    // Listen to local store changes
    LocalCigaretteStore.addListener((event, data) => {
      this.notifyListeners(event, data);
    });

    // Listen to sync manager events
    SyncManager.addListener((event, data) => {
      this.notifyListeners(`sync_${event}`, data);
      
      // Handle specific sync events
      if (event === 'app_became_active' && this.currentUserId) {
        SyncManager.syncNow(this.currentUserId);
      } else if (event === 'should_sync_now' && this.currentUserId) {
        // Handle automatic sync triggers that don't have userId
        SyncManager.syncNow(this.currentUserId);
      }
    });
  }

  // Initialize the data manager with user ID
  async initialize(userId) {
    this.currentUserId = userId;
    this.isInitialized = true;
    
    // Start auto sync
    SyncManager.startAutoSync();
    
    // Trigger initial sync
    if (userId) {
      SyncManager.syncNow(userId);
    }
  }

  // Cleanup when user logs out
  cleanup() {
    this.currentUserId = null;
    this.isInitialized = false;
    SyncManager.stopAutoSync();
  }

  // Add listener for data changes
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in CigaretteDataManager listener:', error);
      }
    });
  }

  // Add a new cigarette log (optimistic update)
  async addCigarette(description = 'Manual', timestamp = null) {
    if (!this.currentUserId) {
      throw new Error('User not initialized');
    }

    try {
      // Add to local storage immediately (optimistic update)
      const newLog = await LocalCigaretteStore.addLog({
        userId: this.currentUserId,
        description,
        timestamp: timestamp || new Date().toISOString()
      });

      // Trigger background sync
      if (SyncManager.isOnline) {
        SyncManager.syncNow(this.currentUserId);
      }


      return newLog;
    } catch (error) {
      console.error('Error adding cigarette:', error);
      throw error;
    }
  }

  // Delete a cigarette log (optimistic update)
  async deleteCigarette(localId) {
    try {
      // Delete from local storage immediately (optimistic update)
      const deletedLog = await LocalCigaretteStore.deleteLog(localId);

      // Trigger background sync
      if (SyncManager.isOnline) {
        SyncManager.syncNow(this.currentUserId);
      }


      return deletedLog;
    } catch (error) {
      console.error('Error deleting cigarette:', error);
      throw error;
    }
  }

  // Get today's cigarette logs
  async getTodayLogs() {
    try {
      return await LocalCigaretteStore.getTodayLogs();
    } catch (error) {
      console.error('Error getting today logs:', error);
      return [];
    }
  }

  // Get today's cigarette count
  async getTodayCount() {
    try {
      const logs = await this.getTodayLogs();
      return logs.length;
    } catch (error) {
      console.error('Error getting today count:', error);
      return 0;
    }
  }

  // Get all cigarette logs
  async getAllLogs() {
    try {
      return await LocalCigaretteStore.getAllLogs();
    } catch (error) {
      console.error('Error getting all logs:', error);
      return [];
    }
  }

  // Get sync status information
  async getSyncStatus() {
    try {
      const syncStatus = await SyncManager.getSyncStatus();
      const localStats = await LocalCigaretteStore.getSyncStats();
      
      return {
        ...syncStatus,
        localStats,
        isInitialized: this.isInitialized,
        hasUserId: !!this.currentUserId
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        isSyncing: false,
        isOnline: false,
        lastSyncTime: null,
        retryQueueSize: 0,
        stats: { total: 0, synced: 0, pending: 0, failed: 0, deletedPending: 0 },
        localStats: { total: 0, synced: 0, pending: 0, failed: 0, deletedPending: 0 },
        isInitialized: this.isInitialized,
        hasUserId: !!this.currentUserId
      };
    }
  }

  // Force manual sync
  async forceSync() {
    if (!this.currentUserId) {
      throw new Error('User not initialized');
    }

    try {
      await SyncManager.triggerManualSync(this.currentUserId);
    } catch (error) {
      console.error('Error forcing sync:', error);
      throw error;
    }
  }

  // Force full sync (useful for troubleshooting)
  async forceFullSync() {
    if (!this.currentUserId) {
      throw new Error('User not initialized');
    }

    try {
      await SyncManager.forceFullSync(this.currentUserId);
    } catch (error) {
      console.error('Error forcing full sync:', error);
      throw error;
    }
  }

  // Get network status
  async getNetworkStatus() {
    try {
      return await SyncManager.getNetworkStatus();
    } catch (error) {
      console.error('Error getting network status:', error);
      return {
        isConnected: false,
        type: 'unknown',
        isWifiEnabled: null,
        strength: null
      };
    }
  }

  // Get logs with specific filter
  async getLogsFiltered(filter = {}) {
    try {
      const allLogs = await this.getAllLogs();
      let filteredLogs = allLogs;

      // Filter by date range
      if (filter.startDate || filter.endDate) {
        filteredLogs = filteredLogs.filter(log => {
          const logDate = new Date(log.timestamp);
          if (filter.startDate && logDate < new Date(filter.startDate)) {
            return false;
          }
          if (filter.endDate && logDate > new Date(filter.endDate)) {
            return false;
          }
          return true;
        });
      }

      // Filter by sync status
      if (filter.syncStatus) {
        filteredLogs = filteredLogs.filter(log => 
          log.syncStatus === filter.syncStatus
        );
      }

      // Filter by description/source
      if (filter.source) {
        filteredLogs = filteredLogs.filter(log => 
          log.description.toLowerCase().includes(filter.source.toLowerCase())
        );
      }

      // Exclude deleted pending logs from UI
      if (!filter.includeDeletingLogs) {
        filteredLogs = filteredLogs.filter(log => 
          log.syncStatus !== 'deleted_pending'
        );
      }

      return filteredLogs;
    } catch (error) {
      console.error('Error getting filtered logs:', error);
      return [];
    }
  }

  // Get logs grouped by date (useful for UI)
  async getLogsGroupedByDate(filter = {}) {
    try {
      const logs = await this.getLogsFiltered(filter);
      const groups = {};

      logs.forEach(log => {
        const dateKey = new Date(log.timestamp).toISOString().split('T')[0];
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(log);
      });

      // Convert to array and sort by date (newest first)
      const groupedArray = Object.keys(groups)
        .sort((a, b) => new Date(b) - new Date(a))
        .map(date => ({
          date,
          logs: groups[date].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          ),
          count: groups[date].length
        }));

      return groupedArray;
    } catch (error) {
      console.error('Error getting grouped logs:', error);
      return [];
    }
  }

  // Get statistics for a date range
  async getStatistics(startDate = null, endDate = null) {
    try {
      const filter = {};
      if (startDate) filter.startDate = startDate;
      if (endDate) filter.endDate = endDate;

      const logs = await this.getLogsFiltered(filter);
      
      const stats = {
        totalLogs: logs.length,
        deviceLogs: logs.filter(log => 
          log.description.toLowerCase().includes('device') || 
          log.description.toLowerCase().includes('automatic')
        ).length,
        manualLogs: logs.filter(log => 
          log.description.toLowerCase().includes('manual')
        ).length,
        syncedLogs: logs.filter(log => log.syncStatus === 'synced').length,
        pendingLogs: logs.filter(log => log.syncStatus === 'pending').length,
        failedLogs: logs.filter(log => log.syncStatus === 'failed').length,
        averagePerDay: 0
      };

      // Calculate average per day if we have a date range
      if (startDate && endDate && stats.totalLogs > 0) {
        const daysDiff = Math.ceil(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        ) + 1;
        stats.averagePerDay = parseFloat((stats.totalLogs / daysDiff).toFixed(2));
      }

      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalLogs: 0,
        deviceLogs: 0,
        manualLogs: 0,
        syncedLogs: 0,
        pendingLogs: 0,
        failedLogs: 0,
        averagePerDay: 0
      };
    }
  }

  // Clear all data (for logout or reset)
  async clearAllData() {
    try {
      await LocalCigaretteStore.clearAllData();
      SyncManager.clearRetryQueue();
      this.cleanup();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Health check for the data manager
  async healthCheck() {
    try {
      const syncStatus = await this.getSyncStatus();
      const todayLogs = await this.getTodayLogs();
      const networkStatus = await this.getNetworkStatus();
      
      return {
        isHealthy: true,
        isInitialized: this.isInitialized,
        hasUserId: !!this.currentUserId,
        localStoreWorking: Array.isArray(todayLogs),
        syncManagerWorking: typeof syncStatus === 'object',
        networkWorking: typeof networkStatus === 'object',
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        isHealthy: false,
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }
}

export default new CigaretteDataManager();