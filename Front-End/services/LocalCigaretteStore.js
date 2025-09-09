import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalCigaretteStore {
  constructor() {
    this.BASE_STORAGE_KEY = 'cigarette_logs';
    this.BASE_TODAY_CACHE_KEY = 'today_cigarette_logs';
    this.BASE_LAST_SYNC_KEY = 'last_sync_timestamp';
    this.listeners = new Set();
    this.currentUserId = null;
  }

  // Get user-specific storage keys
  getStorageKeys(userId) {
    if (!userId) {
      throw new Error('User ID is required for storage operations');
    }
    return {
      STORAGE_KEY: `${this.BASE_STORAGE_KEY}_${userId}`,
      TODAY_CACHE_KEY: `${this.BASE_TODAY_CACHE_KEY}_${userId}`,
      LAST_SYNC_KEY: `${this.BASE_LAST_SYNC_KEY}_${userId}`
    };
  }

  // Initialize store with user ID
  initialize(userId) {
    this.currentUserId = userId;
  }

  // Clear user context on logout
  clearUserContext() {
    this.currentUserId = null;
  }

  // Generate unique local ID
  generateLocalId() {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get today's date string for comparison
  getTodayDateString() {
    return new Date().toISOString().split('T')[0];
  }

  // Add listener for data changes
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of data changes
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in LocalCigaretteStore listener:', error);
      }
    });
  }

  // Get all cigarette logs
  async getAllLogs(userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      const { STORAGE_KEY } = this.getStorageKeys(userIdToUse);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all logs:', error);
      return [];
    }
  }

  // Get today's cigarette logs (optimized)
  async getTodayLogs(userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      const { TODAY_CACHE_KEY } = this.getStorageKeys(userIdToUse);
      const todayString = this.getTodayDateString();
      
      // First try to get from today's cache
      const cachedData = await AsyncStorage.getItem(TODAY_CACHE_KEY);
      if (cachedData) {
        const { date, logs } = JSON.parse(cachedData);
        if (date === todayString) {
          return logs;
        }
      }

      // If cache miss or different day, get from main storage
      const allLogs = await this.getAllLogs(userIdToUse);
      const todayLogs = allLogs.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        return logDate === todayString && log.syncStatus !== 'deleted_pending';
      });

      // Update cache
      await AsyncStorage.setItem(TODAY_CACHE_KEY, JSON.stringify({
        date: todayString,
        logs: todayLogs
      }));

      return todayLogs;
    } catch (error) {
      console.error('Error getting today logs:', error);
      return [];
    }
  }

  // Add a new cigarette log
  async addLog(logData) {
    try {
      const userId = logData.userId || this.currentUserId;
      if (!userId) {
        throw new Error('User ID is required');
      }
      const { STORAGE_KEY, TODAY_CACHE_KEY } = this.getStorageKeys(userId);
      
      const newLog = {
        localId: this.generateLocalId(),
        serverId: null,
        userId: userId,
        description: logData.description || 'Manual',
        timestamp: logData.timestamp || new Date().toISOString(),
        syncStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to main storage
      const allLogs = await this.getAllLogs(userId);
      allLogs.push(newLog);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));

      // Update today's cache if it's today's log
      const logDate = new Date(newLog.timestamp).toISOString().split('T')[0];
      const todayString = this.getTodayDateString();
      
      if (logDate === todayString) {
        const todayLogs = await this.getTodayLogs(userId);
        todayLogs.push(newLog);
        await AsyncStorage.setItem(TODAY_CACHE_KEY, JSON.stringify({
          date: todayString,
          logs: todayLogs
        }));
      }

      // Notify listeners
      this.notifyListeners('log_added', newLog);
      
      return newLog;
    } catch (error) {
      console.error('Error adding log:', error);
      throw error;
    }
  }

  // Update a log's sync status
  async updateLogSyncStatus(localId, syncStatus, serverId = null, userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      const { STORAGE_KEY } = this.getStorageKeys(userIdToUse);
      
      const allLogs = await this.getAllLogs(userIdToUse);
      const logIndex = allLogs.findIndex(log => log.localId === localId);
      
      if (logIndex === -1) {
        throw new Error('Log not found');
      }

      allLogs[logIndex].syncStatus = syncStatus;
      allLogs[logIndex].updatedAt = new Date().toISOString();
      
      if (serverId) {
        allLogs[logIndex].serverId = serverId;
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));

      // Update today's cache if it's today's log
      const logDate = new Date(allLogs[logIndex].timestamp).toISOString().split('T')[0];
      const todayString = this.getTodayDateString();
      
      if (logDate === todayString) {
        await this.refreshTodayCache(userIdToUse);
      }

      this.notifyListeners('log_updated', allLogs[logIndex]);
      
      return allLogs[logIndex];
    } catch (error) {
      console.error('Error updating log sync status:', error);
      throw error;
    }
  }

  // Delete a log by localId
  async deleteLog(localId, userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      const { STORAGE_KEY } = this.getStorageKeys(userIdToUse);
      
      const allLogs = await this.getAllLogs(userIdToUse);
      const logIndex = allLogs.findIndex(log => log.localId === localId);
      
      if (logIndex === -1) {
        throw new Error('Log not found');
      }

      const deletedLog = allLogs[logIndex];
      
      // If log is already synced, mark as deleted instead of removing
      if (deletedLog.serverId && deletedLog.syncStatus === 'synced') {
        allLogs[logIndex].syncStatus = 'deleted_pending';
        allLogs[logIndex].updatedAt = new Date().toISOString();
      } else {
        // Remove completely if not synced yet
        allLogs.splice(logIndex, 1);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));

      // Update today's cache
      const logDate = new Date(deletedLog.timestamp).toISOString().split('T')[0];
      const todayString = this.getTodayDateString();
      
      if (logDate === todayString) {
        await this.refreshTodayCache(userIdToUse);
      }

      this.notifyListeners('log_deleted', deletedLog);
      
      return deletedLog;
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  }

  // Get logs that need to be synced
  async getUnsyncedLogs(userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      
      const allLogs = await this.getAllLogs(userIdToUse);
      return allLogs.filter(log => 
        log.syncStatus === 'pending' || 
        log.syncStatus === 'failed' ||
        log.syncStatus === 'deleted_pending'
      );
    } catch (error) {
      console.error('Error getting unsynced logs:', error);
      return [];
    }
  }

  // Refresh today's cache from main storage
  async refreshTodayCache(userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      const { TODAY_CACHE_KEY } = this.getStorageKeys(userIdToUse);
      
      const todayString = this.getTodayDateString();
      const allLogs = await this.getAllLogs(userIdToUse);
      const todayLogs = allLogs.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        return logDate === todayString && log.syncStatus !== 'deleted_pending';
      });

      await AsyncStorage.setItem(TODAY_CACHE_KEY, JSON.stringify({
        date: todayString,
        logs: todayLogs
      }));

      return todayLogs;
    } catch (error) {
      console.error('Error refreshing today cache:', error);
      return [];
    }
  }

  // Merge server data with local data
  async mergeServerData(serverLogs, userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      const { STORAGE_KEY } = this.getStorageKeys(userIdToUse);
      
      const allLogs = await this.getAllLogs(userIdToUse);
      const mergedLogs = [...allLogs];
      let hasChanges = false;

      // Process each server log
      for (const serverLog of serverLogs) {
        const existingLogIndex = mergedLogs.findIndex(log => 
          log.serverId === serverLog.id || 
          (log.timestamp === serverLog.timestamp && log.userId === serverLog.userId)
        );

        if (existingLogIndex >= 0) {
          // Update existing log with server data
          const existingLog = mergedLogs[existingLogIndex];
          if (existingLog.syncStatus === 'pending' || existingLog.syncStatus === 'failed') {
            mergedLogs[existingLogIndex] = {
              ...existingLog,
              serverId: serverLog.id,
              syncStatus: 'synced',
              updatedAt: new Date().toISOString()
            };
            hasChanges = true;
          }
        } else {
          // Add new log from server
          const newLog = {
            localId: this.generateLocalId(),
            serverId: serverLog.id,
            userId: serverLog.userId,
            description: serverLog.description,
            timestamp: serverLog.timestamp,
            syncStatus: 'synced',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          mergedLogs.push(newLog);
          hasChanges = true;
        }
      }

      if (hasChanges) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedLogs));
        await this.refreshTodayCache(userIdToUse);
        this.notifyListeners('data_merged', { serverLogs, localLogs: mergedLogs });
      }

      return mergedLogs;
    } catch (error) {
      console.error('Error merging server data:', error);
      throw error;
    }
  }

  // Get last sync timestamp
  async getLastSyncTimestamp(userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      const { LAST_SYNC_KEY } = this.getStorageKeys(userIdToUse);
      
      const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      console.error('Error getting last sync timestamp:', error);
      return null;
    }
  }

  // Update last sync timestamp
  async updateLastSyncTimestamp(userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      const { LAST_SYNC_KEY } = this.getStorageKeys(userIdToUse);
      
      const now = new Date().toISOString();
      await AsyncStorage.setItem(LAST_SYNC_KEY, now);
      return now;
    } catch (error) {
      console.error('Error updating last sync timestamp:', error);
    }
  }

  // Clear all data (for debugging or logout)
  async clearAllData(userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        // If no user ID, clear the current user context only
        this.clearUserContext();
        return;
      }
      
      const { STORAGE_KEY, TODAY_CACHE_KEY, LAST_SYNC_KEY } = this.getStorageKeys(userIdToUse);
      
      await AsyncStorage.multiRemove([
        STORAGE_KEY,
        TODAY_CACHE_KEY,
        LAST_SYNC_KEY
      ]);
      
      // Clear user context if clearing current user's data
      if (userIdToUse === this.currentUserId) {
        this.clearUserContext();
      }
      
      this.notifyListeners('data_cleared', { userId: userIdToUse });
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Get sync statistics
  async getSyncStats(userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        return { total: 0, synced: 0, pending: 0, failed: 0, deletedPending: 0 };
      }
      
      const allLogs = await this.getAllLogs(userIdToUse);
      const stats = {
        total: allLogs.length,
        synced: allLogs.filter(log => log.syncStatus === 'synced').length,
        pending: allLogs.filter(log => log.syncStatus === 'pending').length,
        failed: allLogs.filter(log => log.syncStatus === 'failed').length,
        deletedPending: allLogs.filter(log => log.syncStatus === 'deleted_pending').length
      };
      
      return stats;
    } catch (error) {
      console.error('Error getting sync stats:', error);
      return { total: 0, synced: 0, pending: 0, failed: 0, deletedPending: 0 };
    }
  }

  // Remove log completely from local storage (used by SyncManager)
  async removeLogCompletely(localId, userId = null) {
    try {
      const userIdToUse = userId || this.currentUserId;
      if (!userIdToUse) {
        throw new Error('User ID is required');
      }
      const { STORAGE_KEY } = this.getStorageKeys(userIdToUse);
      
      const allLogs = await this.getAllLogs(userIdToUse);
      const filteredLogs = allLogs.filter(log => log.localId !== localId);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLogs));
      await this.refreshTodayCache(userIdToUse);
      
      this.notifyListeners('log_removed_completely', { localId, userId: userIdToUse });
    } catch (error) {
      console.error('Error removing log completely:', error);
      throw error;
    }
  }
}

export default new LocalCigaretteStore();