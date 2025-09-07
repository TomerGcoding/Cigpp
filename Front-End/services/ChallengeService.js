import { API_BASE_URL } from "../config/firebase/apiConfig";

class ChallengeService {
    /**
     * Get available challenges for a user
     */
    async getUserUpcomingChallenges(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/challenges/users/${userId}/upcoming`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "User-ID": userId,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch available challenges");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching available challenges:", error);
            throw error;
        }
    }

    /**
     * Get user's active challenges
     */
    async getUserActiveChallenges(userId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/challenges/users/${userId}/active`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "User-ID": userId,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch user active challenges");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching user active challenges:", error);
            throw error;
        }
    }

    /**
     * Get user's completed challenges
     */
    async getUserCompletedChallenges(userId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/challenges/users/${userId}/completed`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "User-ID": userId,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch user completed challenges");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching user completed challenges:", error);
            throw error;
        }
    }

    /**
     * Get challenge by ID
     */
    async getChallengeById(challengeId, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "User-ID": userId,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch challenge details");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching challenge details:", error);
            throw error;
        }
    }

    /**
     * Create a new challenge
     */
    async createChallenge(challengeData, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/challenges`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-ID": userId,
                },
                body: JSON.stringify(challengeData),
            });

            if (!response.ok) {
                throw new Error("Failed to create challenge");
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating challenge:", error);
            throw error;
        }
    }

    /**
     * Join a challenge
     */
    async joinChallenge(challengeId, userId, personalTarget = null) {
        try {
            const body = personalTarget ? { personalTarget } : {};

            const response = await fetch(
                `${API_BASE_URL}/challenges/${challengeId}/join`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "User-ID": userId,
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to join challenge");
            }

            return response.ok;
        } catch (error) {
            console.error("Error joining challenge:", error);
            throw error;
        }
    }

    /**
     * Leave a challenge
     */
    async leaveChallenge(challengeId, userId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/challenges/${challengeId}/leave`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "User-ID": userId,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to leave challenge");
            }

            return response.ok;
        } catch (error) {
            console.error("Error leaving challenge:", error);
            throw error;
        }
    }

    /**
     * Get challenge leaderboard
     */
    async getChallengeLeaderboard(challengeId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/challenges/${challengeId}/leaderboard`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch challenge leaderboard");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching challenge leaderboard:", error);
            throw error;
        }
    }

    /**
     * Get user progress in a challenge
     */
    async getUserProgress(challengeId, userId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/challenges/${challengeId}/progress/${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch user progress");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching user progress:", error);
            throw error;
        }
    }

    /**
     * Update challenge
     */
    async updateChallenge(challengeId, updateData, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "User-ID": userId,
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error("Failed to update challenge");
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating challenge:", error);
            throw error;
        }
    }

    /**
     * Delete challenge
     */
    async deleteChallenge(challengeId, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "User-ID": userId,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete challenge");
            }

            return response.ok;
        } catch (error) {
            console.error("Error deleting challenge:", error);
            throw error;
        }
    }

    /**
     * Get challenge statistics
     */
    async getChallengeStatistics(challengeId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/challenges/${challengeId}/statistics`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch challenge statistics");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching challenge statistics:", error);
            throw error;
        }
    }

    /**
     * Get user challenge statistics
     */
    async getUserChallengeStatistics(userId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/challenges/users/${userId}/statistics`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch user challenge statistics");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching user challenge statistics:", error);
            throw error;
        }
    }

    /**
     * Helper method to format challenge type name
     */
    getChallengeTypeName(challengeType) {
        switch (challengeType) {
            case "LEAST_SMOKED_WINS":
                return "Least Smoked Wins";
            case "DAILY_TARGET_POINTS":
                return "Daily Target Points";
            default:
                return "Unknown Challenge Type";
        }
    }

    /**
     * Helper method to format time frame
     */
    getTimeFrameText(timeFrameDays) {
        if (timeFrameDays === 1) return "1 Day";
        if (timeFrameDays === 3) return "3 Days";
        if (timeFrameDays === 7) return "1 Week";
        if (timeFrameDays === 14) return "2 Weeks";
        if (timeFrameDays === 30) return "1 Month";
        return `${timeFrameDays} Days`;
    }

    /**
     * Helper method to calculate days remaining
     */
    getDaysRemaining(endDate) {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Completed";
        if (diffDays === 0) return "Ends today";
        if (diffDays === 1) return "1 day left";
        return `${diffDays} days left`;
    }
}

export default new ChallengeService();