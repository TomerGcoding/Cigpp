import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChallengesScreen from "../screens/Challenges/ChallengesScreen";
import CreateChallengeScreen from "../screens/Challenges/CreateChallengeScreen";
import ChallengeTimeFrameScreen from "../screens/Challenges/ChallengeTimeFrameScreen";
import ChallengeTypeScreen from "../screens/Challenges/ChallengeTypeScreen";
import ChallengeSummaryScreen from "../screens/Challenges/ChallengeSummaryScreen";
import ChallengeDetailScreen from "../screens/Challenges/ChallengeDetailScreen";
import ChallengeResultsScreen from "../screens/Challenges/ChallengeResultsScreen";

const Stack = createNativeStackNavigator();

const ChallengesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChallengesHome" component={ChallengesScreen} />
      <Stack.Screen name="CreateChallenge" component={CreateChallengeScreen} />
      <Stack.Screen
        name="ChallengeTimeFrame"
        component={ChallengeTimeFrameScreen}
      />
      <Stack.Screen name="ChallengeType" component={ChallengeTypeScreen} />
      <Stack.Screen
        name="ChallengeSummary"
        component={ChallengeSummaryScreen}
      />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
      <Stack.Screen
        name="ChallengeResults"
        component={ChallengeResultsScreen}
      />
    </Stack.Navigator>
  );
};

export default ChallengesStack;
