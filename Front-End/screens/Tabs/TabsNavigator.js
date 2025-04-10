import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SummaryNavigator from "./Summary/SummaryNavigator";

const Tab = createBottomTabNavigator();
const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Summary" component={SummaryNavigator}></Tab.Screen>
      <Tab.Screen name="Bechki" component={SummaryNavigator}></Tab.Screen>
    </Tab.Navigator>
  );
};
export default TabsNavigator;
