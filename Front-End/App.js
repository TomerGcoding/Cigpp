import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabsNavigator from "./screens/Tabs/TabsNavigator";
import AuthStack from "./screens/Stacks/AuthStack";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    MontserratItalic: require("./assets/fonts/Montserrat-Italic.ttf"),
    MontserratRegular: require("./assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("./assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthContext.Consumer>
          {({ user }) => (user ? <TabsNavigator /> : <AuthStack />)}
        </AuthContext.Consumer>
      </NavigationContainer>
    </AuthProvider>
  );
}
