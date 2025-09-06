import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalCigaretteStore {
  constructor() {
    this.STORAGE_KEY = 'cigarette_logs';
    this.TODAY_CACHE_KEY = 'today_cigarette_logs';
    this.LAST_SYNC_KEY = 'last_sync_timestamp';
    this.listeners = new Set();
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
  async getAllLogs() {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all logs:', error);
      return [];
    }
  }

  // Get today's cigarette logs (optimized)
  async getTodayLogs() {
    try {
      const todayString = this.getTodayDateString();
      
      // First try to get from today's cache
      const cachedData = await AsyncStorage.getItem(this.TODAY_CACHE_KEY);
      if (cachedData) {
        const { date, logs } = JSON.parse(cachedData);
        if (date === todayString) {
          return logs;
        }
      }

      // If cache miss or different day, get from main storage
      const allLogs = await this.getAllLogs();
      const todayLogs = allLogs.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        return logDate === todayString && log.syncStatus !== 'deleted_pending';
      });

      // Update cache
      await AsyncStorage.setItem(this.TODAY_CACHE_KEY, JSON.stringify({
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
      const newLog = {
        localId: this.generateLocalId(),
        serverId: null,
        userId: logData.userId,
        description: logData.description || 'Manual',
        timestamp: logData.timestamp || new Date().toISOString(),
        syncStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to main storage
      const allLogs = await this.getAllLogs();
      allLogs.push(newLog);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(allLogs));

      // Update today's cache if it's today's log
      const logDate = new Date(newLog.timestamp).toISOString().split('T')[0];
      const todayString = this.getTodayDateString();
      
      if (logDate === todayString) {
        const todayLogs = await this.getTodayLogs();
        todayLogs.push(newLog);
        await AsyncStorage.setItem(this.TODAY_CACHE_KEY, JSON.stringify({
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
  async updateLogSyncStatus(localId, syncStatus, serverId = null) {
    try {
      const allLogs = await this.getAllLogs();
      const logIndex = allLogs.findIndex(log => log.localId === localId);
      
      if (logIndex === -1) {
        throw new Error('Log not found');
      }

      allLogs[logIndex].syncStatus = syncStatus;
      allLogs[logIndex].updatedAt = new Date().toISOString();
      
      if (serverId) {
        allLogs[logIndex].serverId = serverId;
      }

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(allLogs));

      // Update today's cache if it's today's log
      const logDate = new Date(allLogs[logIndex].timestamp).toISOString().split('T')[0];
      const todayString = this.getTodayDateString();
      
      if (logDate === todayString) {
        await this.refreshTodayCache();
      }

      this.notifyListeners('log_updated', allLogs[logIndex]);
      
      return allLogs[logIndex];
    } catch (error) {
      console.error('Error updating log sync status:', error);
      throw error;
    }
  }

  // Delete a log by localId
  async deleteLog(localId) {
    try {
      const allLogs = await this.getAllLogs();
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

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(allLogs));

      // Update today's cache
      const logDate = new Date(deletedLog.timestamp).toISOString().split('T')[0];
      const todayString = this.getTodayDateString();
      
      if (logDate === todayString) {
        await this.refreshTodayCache();
      }

      this.notifyListeners('log_deleted', deletedLog);
      
      return deletedLog;
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  }

  // Get logs that need to be synced
  async getUnsyncedLogs() {
    try {
      const allLogs = await this.getAllLogs();
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
  async refreshTodayCache() {
    try {
      const todayString = this.getTodayDateString();
      const allLogs = await this.getAllLogs();
      const todayLogs = allLogs.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        return logDate === todayString && log.syncStatus !== 'deleted_pending';
      });

      await AsyncStorage.setItem(this.TODAY_CACHE_KEY, JSON.stringify({
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
  async mergeServerData(serverLogs) {
    try {
      const allLogs = await this.getAllLogs();
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
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(mergedLogs));
        await this.refreshTodayCache();
        this.notifyListeners('data_merged', { serverLogs, localLogs: mergedLogs });
      }

      return mergedLogs;
    } catch (error) {
      console.error('Error merging server data:', error);
      throw error;
    }
  }

  // Get last sync timestamp
  async getLastSyncTimestamp() {
    try {
      const timestamp = await AsyncStorage.getItem(this.LAST_SYNC_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      console.error('Error getting last sync timestamp:', error);
      return null;
    }
  }

  // Update last sync timestamp
  async updateLastSyncTimestamp() {
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(this.LAST_SYNC_KEY, now);
      return now;
    } catch (error) {
      console.error('Error updating last sync timestamp:', error);
    }
  }

  // Clear all data (for debugging or logout)
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        this.STORAGE_KEY,
        this.TODAY_CACHE_KEY,
        this.LAST_SYNC_KEY
      ]);
      this.notifyListeners('data_cleared');
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Get sync statistics
  async getSyncStats() {
    try {
      const allLogs = await this.getAllLogs();
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
  async removeLogCompletely(localId) {
    try {
      const allLogs = await this.getAllLogs();
      const filteredLogs = allLogs.filter(log => log.localId !== localId);
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredLogs));
      await this.refreshTodayCache();
      
      this.notifyListeners('log_removed_completely', { localId });
    } catch (error) {
      console.error('Error removing log completely:', error);
      throw error;
    }
  }
}

export default new LocalCigaretteStore();