import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../config/firebase/firebaseConfig";
import CigaretteDataManager from "../services/CigaretteDataManager";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);
        // Initialize the data manager with the user ID
        try {
          await CigaretteDataManager.initialize(firebaseUser.uid);
          console.log('CigaretteDataManager initialized for user:', firebaseUser.uid);
        } catch (error) {
          console.error('Failed to initialize CigaretteDataManager:', error);
        }
      } else {
        // User is not signed in
        setUser(null);
        // Cleanup data manager
        try {
          await CigaretteDataManager.cleanup();
          console.log('CigaretteDataManager cleaned up');
        } catch (error) {
          console.error('Failed to cleanup CigaretteDataManager:', error);
        }
      }
      setIsLoading(false); // Authentication check complete
    });

    return unsubscribe; // Cleanup the listener on unmount
  }, []);

  const logout = async () => {
    setIsLoading(true);
    try {
      // Cleanup data manager before signing out
      await CigaretteDataManager.clearAllData();
      await FIREBASE_AUTH.signOut();
      // No need to manually remove from AsyncStorage since Firebase handles this
      // with the persistence you've set up
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth() {
  return useContext(AuthContext);
}
