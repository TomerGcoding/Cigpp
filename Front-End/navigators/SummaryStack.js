import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLOR, FONT } from "../constants/theme";
import BTModal from "../screens/Profile/ProfileModals/BTModal";
import SummaryScreen from "../screens/Summary/SummaryScreen";
import CigarettesLogsModal from "../screens/Summary/SummaryModals/CigarettesLogsModal";
import AchievementsModal from "../screens/Summary/SummaryModals/AchievementsModal";
import DetailedStatsModal from "../screens/Summary/SummaryModals/DetailedStatsModal";
import DeviceModal from "../screens/Summary/SummaryModals/DeviceModal";
const Stack = createNativeStackNavigator();

const SummaryStack = () => {
  return (
    <Stack.Navigator initialRouteName="Summary">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Summary"
        component={SummaryScreen}
      />

      <Stack.Group
        screenOptions={{
          presentation: "modal",
          headerTransparent: true,
          headerTintColor: COLOR.primary,
          headerTitleStyle: { fontFamily: FONT.bold },
        }}
      >
        <Stack.Screen
          name="Detailed Cigarettes"
          component={DetailedStatsModal}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cigarette Logs"
          component={CigarettesLogsModal}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="My Device" component={DeviceModal} />
        <Stack.Screen
          name="Achievements"
          component={AchievementsModal}
          options={{ headerShown: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
export default SummaryStack;
