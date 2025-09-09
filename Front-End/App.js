import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppNavigator from "./navigators/AppNavigator";
import { PreferencesProvider } from "./contexts/PreferencesContext";
import { BleProvider } from "./contexts/BleContext";

// Wrapper component to access user from AuthContext
const AppWithProviders = () => {
  const { user } = useAuth();
  
  return (
    <PreferencesProvider>
      <BleProvider user={user}>
        <AppNavigator />
      </BleProvider>
    </PreferencesProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppWithProviders />
    </AuthProvider>
  );
}
