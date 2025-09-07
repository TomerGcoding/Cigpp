import { API_BASE_URL } from "../config/firebase/apiConfig";

class StatisticsService {
    /**
     * Get weekly statistics for a user
     */
    async getWeeklyStats(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/statistics/weekly/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch weekly statistics");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching weekly statistics:", error);
            throw error;
        }
    }

    /**
     * Get monthly statistics for a user
     */
    async getMonthlyStats(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/statistics/monthly/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch monthly statistics");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching monthly statistics:", error);
            throw error;
        }
    }

    /**
     * Get yearly statistics for a user
     */
    async getYearlyStats(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/statistics/yearly/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch yearly statistics");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching yearly statistics:", error);
            throw error;
        }
    }

    /**
     * Get statistics summary for a user and period
     */
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
                throw new Error("Failed to fetch statistics summary");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching statistics summary:", error);
            throw error;
        }
    }

    /**
     * Get trend data for a user
     */
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
            throw error;
        }
    }
}

export default new StatisticsService();