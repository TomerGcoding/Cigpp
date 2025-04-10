import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SummaryScreen from "./SummaryScreen";
import ProfileScreen from "./Profile/ProfileScreen";
import TrackedCigarettesScreen from "./Tracked/TrackedCigarettesScreen";

const Stack = createNativeStackNavigator();

const SummaryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SummaryMain"
    >
      <Stack.Screen name="SummaryMain" component={SummaryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="TrackedCigarettes"
        component={TrackedCigarettesScreen}
      />
    </Stack.Navigator>
  );
};

export default SummaryNavigator;
