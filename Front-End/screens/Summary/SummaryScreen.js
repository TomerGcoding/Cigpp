import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePreferences } from "../../contexts/PreferencesContext";
import { COLOR } from "../../constants/theme";
import styles from "./SummaryStyle";
import TouchableBox from "../../components/TouchableBox";
import CustomClickableIcon from "../../components/CustomClickableIcon";
import ProgressCircleCard from "../../components/ProgressCircleCard";

const SummaryScreen = () => {
  const navigation = useNavigation();
  const { preferences } = usePreferences();
  const [todayCount, setTodayCount] = useState(7); // Replace with actual data
  const [showTip, setShowTip] = useState(true);
  const [streakDays, setStreakDays] = useState(3); // Replace with actual streak

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    const ratio = todayCount / preferences.targetConsumption;

    if (ratio >= 1) {
      return "You've reached your daily limit. Consider taking a break.";
    } else if (ratio >= 0.75) {
      return "You're approaching your daily limit. Try to pace yourself.";
    } else if (streakDays >= 3) {
      return `Great job! ${streakDays} days of staying under your limit.`;
    } else {
      return "You're doing well today. Keep it up!";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
          <Text style={styles.titleText}>Summary</Text>
        </View>
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            style={styles.bellIcon}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLOR.primary}
            />
            {/* Add notification badge here if needed */}
          </TouchableOpacity>
          <CustomClickableIcon
            onPress={() => navigation.navigate("Profile")}
            color={COLOR.primary}
            size={40}
            name={"person-circle-outline"}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Greeting & Tip */}
        <View style={styles.greetingContainer}>
          {showTip && (
            <TouchableOpacity
              style={styles.tipContainer}
              onPress={() => setShowTip(false)}
            >
              <View style={styles.tipContent}>
                <Ionicons name="bulb-outline" size={20} color={COLOR.white} />
                <Text style={styles.tipText}>{getMotivationalMessage()}</Text>
              </View>
              <Ionicons name="close" size={18} color={COLOR.white} />
            </TouchableOpacity>
          )}
        </View>

        {/* Progress Circle */}
        <ProgressCircleCard
          total={todayCount}
          limit={preferences.targetConsumption}
          onPress={() => navigation.navigate("Detailed Cigarettes")}
        />

        {/* Navigation Boxes */}
        <View style={styles.boxContainer}>
          <TouchableBox
            title="Cigarette Logs"
            subtitle="View your smoking history"
            icon="list-outline"
            onPress={() => navigation.navigate("Cigarette Logs")}
            height={100}
          />
          <View style={styles.touchableBoxContainer}>
            <TouchableBox
              title="My Device"
              subtitle="Manage device"
              icon="watch-outline"
              onPress={() => navigation.navigate("My Device")}
              width={"48%"}
              height={120}
            />
            <TouchableBox
              title="Awards"
              subtitle="View your milestones"
              icon="trophy-outline"
              onPress={() => navigation.navigate("Achievements")}
              width={"48%"}
              height={120}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SummaryScreen;
