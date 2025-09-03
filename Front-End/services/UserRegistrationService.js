import { FIREBASE_AUTH } from "../config/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import AchievementService from "./AchievementsService";

const API_BASE_URL = "http://10.100.102.7:8080/api";

class UserRegistrationService {
  /**
   * Creates a user profile on the backend server
   */
  async createUserProfile(userProfileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfileData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to create user profile: ${response.status} - ${errorData}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  /**
   * Deletes a Firebase user (for rollback purposes)
   */
  async deleteFirebaseUser(user) {
    try {
      await deleteUser(user);
      console.log("Firebase user deleted successfully during rollback");
    } catch (error) {
      console.error("Failed to delete Firebase user during rollback:", error);
      // Log this error but don't throw it, as it's a cleanup operation
    }
  }

  /**
   * Main registration method that handles both Firebase Auth and backend user profile creation
   * with proper rollback mechanism
   */
  async registerUser({
    email,
    password,
    username,
    deviceId,
    currentConsumption,
    targetConsumption,
    tobaccoBrand,
  }) {
    let firebaseUser = null;

    try {
      // Step 1: Create Firebase user
      console.log("Creating Firebase user...");
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      firebaseUser = userCredential.user;

      // Step 2: Update Firebase user profile
      console.log("Updating Firebase user profile...");
      await updateProfile(firebaseUser, {
        displayName: username,
      });

      // Step 3: Prepare user profile data for backend
      const userProfileData = {
        userId: firebaseUser.uid,
        username: username,
        deviceId: deviceId,
        currentConsumption: parseInt(currentConsumption),
        targetConsumption: parseInt(targetConsumption),
        tobacco: tobaccoBrand,
        isBlEnabled: false,
        isNotificationsEnabled: true,
      };

      // Step 4: Create user profile on backend
      console.log("Creating user profile on backend...");
      const backendUserProfile = await this.createUserProfile(userProfileData);

      // Step 5: Attach achievements to user
      console.log("Attaching achievements to user...");
      await AchievementService.attachAchievementsToUser(firebaseUser.uid);

      // Step 6: Schedule daily achievement recalculation
      console.log("Scheduling daily achievement recalculation...");
      AchievementService.scheduleDailyRecalculation(firebaseUser.uid);

      // Success! Both operations completed
      console.log("User registration completed successfully");
      return {
        success: true,
        firebaseUser: firebaseUser,
        backendUserProfile: backendUserProfile,
        message: "User registered successfully",
      };
    } catch (error) {
      console.error("Registration failed:", error);

      // Rollback: If we created a Firebase user but backend failed, delete the Firebase user
      if (firebaseUser) {
        console.log("Rolling back Firebase user creation...");
        await this.deleteFirebaseUser(firebaseUser);
      }

      // Re-throw the error with context
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Alternative approach using Promise.all with manual rollback
   * (Less recommended due to complexity of rollback)
   */
  async registerUserParallel({
    email,
    password,
    username,
    deviceId,
    currentConsumption,
    targetConsumption,
    tobaccoBrand,
  }) {
    try {
      // Step 1: Create Firebase user first (we need the UID for backend)
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Step 2: Update profile and create backend profile in parallel
      const userProfileData = {
        userId: firebaseUser.uid,
        username: username,
        deviceId: deviceId,
        currentConsumption: parseInt(currentConsumption),
        targetConsumption: parseInt(targetConsumption),
        tobacco: tobaccoBrand,
        isBlEnabled: false,
        isNotificationsEnabled: true,
      };

      const [updatedProfile, backendUserProfile] = await Promise.all([
        updateProfile(firebaseUser, { displayName: username }),
        this.createUserProfile(userProfileData),
      ]);

      // Step 3: Attach achievements and schedule recalculation
      await AchievementService.attachAchievementsToUser(firebaseUser.uid);
      AchievementService.scheduleDailyRecalculation(firebaseUser.uid);

      return {
        success: true,
        firebaseUser: firebaseUser,
        backendUserProfile: backendUserProfile,
        message: "User registered successfully",
      };
    } catch (error) {
      // If we get here, we need to check what succeeded and rollback accordingly
      console.error("Parallel registration failed:", error);

      // This is more complex to handle properly, so sequential approach is recommended
      throw new Error(`Registration failed: ${error.message}`);
    }
  }
}

export default new UserRegistrationService();
