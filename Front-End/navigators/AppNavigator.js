import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { AuthContext, useAuth } from "../contexts/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTabs from "./Tabs/HomeTabs";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import AuthStack from "./AuthStack";
import { useFonts } from "expo-font";
import ProfileStack from "./ProfileStack";
import SummaryStack from "./SummaryStack";
import SummaryScreen from "../screens/Summary/SummaryScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const [fontsLoaded] = useFonts({
    MontserratItalic: require("../assets/fonts/Montserrat-Italic.ttf"),
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    // Only hide splash screen when both fonts and auth are ready
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  // Keep showing splash screen while loading
  if (!fontsLoaded || isLoading) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeTabs} />
            <Stack.Screen name="Profile" component={ProfileStack} />
          </>
        ) : (
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Auth"
            component={AuthStack}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
