import { API_BASE_URL } from "../config/firebase/apiConfig";

class StatisticsService {
  async getDailyStats(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/statistics/daily/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch daily stats");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching daily stats:", error);
      // Return fallback data
      return [
        { hour: "12AM", count: 0 },
        { hour: "3AM", count: 0 },
        { hour: "6AM", count: 1 },
        { hour: "9AM", count: 1 },
        { hour: "12PM", count: 1 },
        { hour: "3PM", count: 2 },
        { hour: "6PM", count: 1 },
        { hour: "9PM", count: 1 },
      ];
    }
  }

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
}

export default new StatisticsService();
