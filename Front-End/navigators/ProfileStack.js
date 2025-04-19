import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/Profile/ProfileScreen";
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Profile"
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />

      <Stack.Group
        screenOptions={{
          presentation: "modal",
          headerShown: false,
        }}
      >
        <Stack.Screen name="BTModal" component={BTModal}></Stack.Screen>
        {/* here all the modals will be */}
      </Stack.Group>
    </Stack.Navigator>
  );
};
export default ProfileStack;
