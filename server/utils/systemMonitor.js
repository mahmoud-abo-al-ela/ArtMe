const mongoose = require("mongoose");
const os = require("os");

/**
 * System Monitor Service
 *
 * Provides methods to check the health of various system components
 * and return standardized status responses.
 */
class SystemMonitor {
  /**
   * Status constants
   */
  static STATUS = {
    HEALTHY: "healthy",
    DEGRADED: "degraded",
    DOWN: "down",
  };

  /**
   * Check the status of the MongoDB database
   * @returns {Promise<string>} Status string: 'healthy', 'degraded', or 'down'
   */
  static async checkDatabaseStatus() {
    try {
      // Check mongoose connection state
      // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
      const state = mongoose.connection.readyState;

      if (state === 1) {
        // Additional ping to check responsiveness
        await mongoose.connection.db.admin().ping();
        return this.STATUS.HEALTHY;
      } else if (state === 2) {
        return this.STATUS.DEGRADED;
      } else {
        return this.STATUS.DOWN;
      }
    } catch (error) {
      console.error("Database health check failed:", error);
      return this.STATUS.DEGRADED;
    }
  }

  /**
   * Check status of the API service
   * @returns {string} Status string: 'healthy', 'degraded', or 'down'
   */
  static checkApiStatus() {
    try {
      // Check server load as an indicator of API health
      const loadAvg = os.loadavg()[0];
      const cpuCount = os.cpus().length;

      // If load per CPU is high, consider service degraded
      if (loadAvg / cpuCount > 0.8) {
        return this.STATUS.DEGRADED;
      }

      // Check memory usage
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const memoryUsage = (totalMem - freeMem) / totalMem;
      // If memory usage is above 90%, consider service degraded
      if (memoryUsage > 0.9) {
        return this.STATUS.DEGRADED;
      }

      return this.STATUS.HEALTHY;
    } catch (error) {
      console.error("API health check failed:", error);
      return this.STATUS.DEGRADED;
    }
  }

  /**
   * Perform all health checks
   * @returns {Promise<Object>} Object containing all system statuses and timestamp
   */
  static async checkAllSystems() {
    const [database, api] = await Promise.all([
      this.checkDatabaseStatus(),
      this.checkApiStatus(),
    ]);

    return {
      database,
      api,
      lastUpdated: new Date().toISOString(),
    };
  }
}

module.exports = SystemMonitor;
