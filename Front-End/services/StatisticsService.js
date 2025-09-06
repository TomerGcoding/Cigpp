import { API_BASE_URL } from "../config/firebase/apiConfig";

class StatisticsService {
  async getWeeklyStats(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/statistics/weekly/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weekly stats");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
      // Return fallback data
      return [
        { day: "Mon", count: 5 },
        { day: "Tue", count: 7 },
        { day: "Wed", count: 4 },
        { day: "Thu", count: 6 },
        { day: "Fri", count: 8 },
        { day: "Sat", count: 3 },
        { day: "Sun", count: 5 },
      ];
    }
  }

  async getMonthlyStats(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/statistics/monthly/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch monthly stats");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching monthly stats:", error);
      // Return fallback data
      return [
        { week: "Week 1", count: 32 },
        { week: "Week 2", count: 28 },
        { week: "Week 3", count: 25 },
        { week: "Week 4", count: 22 },
      ];
    }
  }

  async getYearlyStats(userId) {
    try {
      const response = await fetch(
          `${API_BASE_URL}/statistics/yearly/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch yearly stats");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching yearly stats:", error);
      // Return fallback data
      return [
        { month: "Jan", count: 45 },
        { month: "Feb", count: 38 },
        { month: "Mar", count: 42 },
        { month: "Apr", count: 35 },
        { month: "May", count: 28 },
        { month: "Jun", count: 25 },
        { month: "Jul", count: 30 },
        { month: "Aug", count: 33 },
        { month: "Sep", count: 27 },
        { month: "Oct", count: 24 },
        { month: "Nov", count: 20 },
        { month: "Dec", count: 18 },
      ];
    }
  }

  async getStatsSummary(userId, period) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/statistics/summary/${userId}?period=${period}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stats summary");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching stats summary:", error);
      // Return fallback data
      return {
        total: 0,
        average: 0,
        max: 0,
        min: 0,
        currentStreak: 0,
        dateRange: new Date().toLocaleDateString(),
        bestInsight: "No data available yet",
        worstInsight: "Start tracking to see insights",
      };
    }
  }

  async getTrendData(userId, period, targetConsumption) {
    try {
      const response = await fetch(
          `${API_BASE_URL}/statistics/trends/${userId}?period=${period}&targetConsumption=${targetConsumption}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trend data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching trend data:", error);
      // Return fallback data
      return {
        percentageChange: 0,
        daysBelow: 0,
        peakPeriod: period === 'weekly' ? 'Fri' : period === 'monthly' ? 'Week 3' : 'Mar'
      };
    }
  }
}

export default new StatisticsService();
