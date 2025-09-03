const API_BASE_URL = "http://10.100.102.7:8080/api";

class AchievementService {
  /**
   * Attach all achievements to a user (call this during user registration)
   */
  async attachAchievementsToUser(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/achievements/attach/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to attach achievements to user");
      }

      return await response.text();
    } catch (error) {
      console.error("Error attaching achievements to user:", error);
      throw error;
    }
  }

  /**
   * Recalculate achievements for a user
   */
  async recalculateAchievements(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/achievements/recalculate/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to recalculate achievements");
      }

      return response.ok;
    } catch (error) {
      console.error("Error recalculating achievements:", error);
      throw error;
    }
  }

  /**
   * Get user achievements (you'll need to add this endpoint to your backend)
   * This is a suggested endpoint that should return user's achievements with progress
   */
  async getUserAchievements(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/achievements/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user achievements");
      }

      const achievements = await response.json();

      // Transform backend data to match frontend expectations
      return achievements.map((userAchievement) => ({
        id: userAchievement.id.toString(),
        title: userAchievement.achievement.name,
        description: userAchievement.achievement.description,
        icon: userAchievement.achievement.iconName,
        unlocked: userAchievement.isCompleted,
        date: userAchievement.earnedAt
          ? new Date(userAchievement.earnedAt).toISOString().split("T")[0]
          : null,
        progress: userAchievement.progress || 0,
        // Set total based on achievement type - you might want to add this to your backend
        total: this.getTotalForAchievement(userAchievement.achievement.name),
      }));
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      throw error;
    }
  }

  /**
   * Helper method to get total progress needed for each achievement
   * This matches the logic in your AchievementServiceImpl
   */
  getTotalForAchievement(achievementName) {
    switch (achievementName) {
      case "First Step":
        return 1;
      case "Balanced Week":
        return 7;
      case "Light Day":
        return 1;
      case "Monthly Milestone":
        return 30;
      case "Self Aware":
        return 100;
      case "Clean Day":
        return 1;
      case "Master Achiever":
        return 6;
      default:
        return 1;
    }
  }

  /**
   * Schedule daily achievement recalculation
   * This runs locally on the device - for server-side scheduling, consider using a cron job
   */
  scheduleDailyRecalculation(userId) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Schedule first execution at midnight
    setTimeout(() => {
      this.recalculateAchievements(userId);

      // Then schedule daily recalculation every 24 hours
      setInterval(() => {
        this.recalculateAchievements(userId);
      }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    }, msUntilMidnight);

    console.log(
      `Achievement recalculation scheduled for ${tomorrow.toLocaleString()}`
    );
  }
}

export default new AchievementService();
