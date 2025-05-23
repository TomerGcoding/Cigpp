import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";
import { COLOR } from "../../constants/theme";
import SummaryStack from "../SummaryStack";
import ChallengesStack from "../ChallengesStack";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Summary") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Challenges") {
            iconName = focused ? "trophy" : "trophy-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLOR.primary,
        tabBarInactiveTintColor: COLOR.subPrimary,
        tabBarStyle: {
          backgroundColor: COLOR.background,
        },
      })}
    >
      <Tab.Screen name="Summary" component={SummaryStack} />
      <Tab.Screen name="Challenges" component={ChallengesStack} />
    </Tab.Navigator>
  );
};

export default HomeTabs;
