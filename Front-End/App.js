import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "./contexts/AuthContext";
import AppNavigator from "./navigators/AppNavigator";
import { PreferencesProvider } from "./contexts/PreferencesContext";

export default function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <AppNavigator />
      </PreferencesProvider>
    </AuthProvider>
  );
}
