// services/cigaretteLogService.js
import { FIREBASE_AUTH } from "../config/firebase/firebaseConfig";

const API_BASE_URL = "http://10.100.102.4:8080/api";

class CigaretteLogService {
  async addCigaretteLog(log) {
    try {
      const response = await fetch(`${API_BASE_URL}/cigarettes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(log),
      });
      if (!response.ok) {
        throw new Error("Failed to add cigarette log");
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding cigarette log:", error);
      throw error;
    }
  }

  async deleteCigaretteLog(logId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cigarettes/${logId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete cigarette log");
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting cigarette log:", error);
      throw error;
    }
  }

  async getTodayLogs(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cigarettes/${userId}/today`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch today's logs");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching today's logs:", error);
      throw error;
    }
  }
}

export default new CigaretteLogService();
