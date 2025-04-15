import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabsNavigator from "./screens/Tabs/TabsNavigator";
import AuthStack from "./screens/Stacks/AuthStack";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./config/firebase/firebaseConfig";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    MontserratItalic: require("./assets/fonts/Montserrat-Italic.ttf"),
    MontserratRegular: require("./assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("./assets/fonts/Montserrat-Bold.ttf"),
  });

  // Combine both useEffect hooks
  useEffect(() => {
    // Handle auth state changes
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      setUser(currentUser);
    });

    // Hide splash screen when fonts are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    // Clean up the auth listener on unmount
    return unsubscribe;
  }, [fontsLoaded]);

  // Only render the app when fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <TabsNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
