import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./Home/HomeScreen";

const Tab = createBottomTabNavigator();
const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}></Tab.Screen>
      <Tab.Screen name="Bechki" component={HomeScreen}></Tab.Screen>
    </Tab.Navigator>
  );
};
export default TabsNavigator;
