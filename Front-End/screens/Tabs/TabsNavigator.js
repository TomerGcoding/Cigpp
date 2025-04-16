import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../../config/firebase/firebaseConfig";
import SummaryNavigator from "./Summary/SummaryNavigator";

const Tab = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#50C878",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: {
          backgroundColor: "#F8F6F0",
          borderTopColor: "#e0ddd7",
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Summary":
              iconName = "pie-chart-outline";
              break;
            case "Bechki":
              iconName = "cart-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Summary" component={SummaryNavigator} />
      <Tab.Screen name="Bechki" component={SummaryNavigator} />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
