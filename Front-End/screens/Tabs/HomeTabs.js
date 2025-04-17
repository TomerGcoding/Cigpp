import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SummaryScreen from "../Summary/SummaryScreen";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Summary" component={SummaryScreen} />
      <Tab.Screen name="Challenges" component={SummaryScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;
