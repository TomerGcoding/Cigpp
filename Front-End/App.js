import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useFonts } from "expo-font";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTabs from "./screens/Tabs/HomeTabs";
import RegisterScreen from "./screens/Register/RegisterScreen";
import LoginScreen from "./screens/Login/LoginScreen";
import ProfileScreen from "./screens/Profile/ProfileScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
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
          {({ user }) => (
            <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
              {user ? (
                <Stack.Group
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="Home" component={HomeTabs} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                </Stack.Group>
              ) : (
                <Stack.Group
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Group>
              )}
            </Stack.Navigator>
          )}
        </AuthContext.Consumer>
      </NavigationContainer>
    </AuthProvider>
  );
}
