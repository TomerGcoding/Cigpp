import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import BTModal from "../screens/Profile/ProfileModals/BTModal";
import NotificationsModal from "../screens/Profile/ProfileModals/NotificationsModal";
import ChangeGoalsModal from "../screens/Profile/ProfileModals/ChangeGoalsModal";
import PersonalDetailsModal from "../screens/Profile/ProfileModals/PersonalDetailsModal";
import { COLOR, FONT } from "../constants/theme";
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: COLOR.primary,
          headerTransparent: true,
          headerTitleStyle: { fontFamily: FONT.bold },
        }}
        name="Profile"
        component={ProfileScreen}
      />

      <Stack.Group
        screenOptions={{
          presentation: "modal",
          headerTransparent: true,
          headerTintColor: COLOR.primary,
          headerTitleStyle: { fontFamily: FONT.bold },
        }}
      >
        <Stack.Screen name="Bluetooth" component={BTModal} />
        <Stack.Screen name="Notifications" component={NotificationsModal} />
        <Stack.Screen name="Change Goals" component={ChangeGoalsModal} />
        <Stack.Screen
          name="Personal Details"
          component={PersonalDetailsModal}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
export default ProfileStack;
