import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./Home/HomeScreen";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../../config/firebase/firebaseConfig";

const Tab = createBottomTabNavigator();
const TabsNavigator = ({ navigation }) => {
  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    if (user) {
      console.log(user.displayName);
    } else {
      navigation.navigate("Login");
    }
  });

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
