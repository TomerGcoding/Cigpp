import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const PreferencesContext = createContext();

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    username: "",
    currentConsumption: 0,
    targetConsumption: 0,
    enableBluetooth: false,
    enableNotifications: true,
  });

  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Use existing auth context

  // Load preferences from storage when user changes
  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      try {
        if (user) {
          const storedPreferences = await AsyncStorage.getItem(
            `preferences_${user.uid}`
          );
          if (storedPreferences) {
            setPreferences(JSON.parse(storedPreferences));
          } else {
            // Set default preferences with user's displayName if available
            setPreferences((prev) => ({
              ...prev,
              username: user.displayName || "",
            }));
          }
        } else {
          // Reset preferences when logged out
          setPreferences({
            username: "",
            currentConsumption: 0,
            targetConsumption: 0,
            enableBluetooth: false,
            enableNotifications: true,
            tobaccoBrand: "",
          });
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Update a specific preference
  const updatePreference = async (key, value) => {
    try {
      if (user) {
        const updatedPreferences = {
          ...preferences,
          [key]: value,
        };
        setPreferences(updatedPreferences);
        await AsyncStorage.setItem(
          `preferences_${user.uid}`,
          JSON.stringify(updatedPreferences)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating preference:", error);
      return false;
    }
  };

  // Save initial user preferences after registration
  const saveInitialPreferences = async (
    username,
    currentConsumption,
    targetConsumption,
    tobaccoBrand
  ) => {
    try {
      if (user) {
        const initialPreferences = {
          username,
          currentConsumption: parseInt(currentConsumption),
          targetConsumption: parseInt(targetConsumption),
          tobaccoBrand,
          enableBluetooth: false,
          enableNotifications: true,
        };
        setPreferences(initialPreferences);
        await AsyncStorage.setItem(
          `preferences_${user.uid}`,
          JSON.stringify(initialPreferences)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving initial preferences:", error);
      return false;
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        saveInitialPreferences,
        loading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
