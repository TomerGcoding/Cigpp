import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./Home/HomeScreen";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../../config/firebase/firebaseConfig";

const Tab = createBottomTabNavigator();
const TabsNavigator = ({ navigation }) => {
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
        tabBarActiveTintColor: "#50C878",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Summary" component={HomeScreen}></Tab.Screen>
      <Tab.Screen name="Challenges" component={HomeScreen}></Tab.Screen>
    </Tab.Navigator>
  );
};
export default TabsNavigator;
