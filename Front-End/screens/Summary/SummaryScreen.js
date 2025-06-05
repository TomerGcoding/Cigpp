import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePreferences } from "../../contexts/PreferencesContext";
import { useAuth } from "../../contexts/AuthContext";
import { COLOR } from "../../constants/theme";
import styles from "./SummaryStyle";
import TouchableBox from "../../components/TouchableBox";
import CustomClickableIcon from "../../components/CustomClickableIcon";
import ProgressCircleCard from "../../components/ProgressCircleCard";
import CustomButton from "../../components/CustomButton";
import cigaretteLogService from "../../services/cigaretteLogService";

const SummaryScreen = () => {
  const navigation = useNavigation();
  const { preferences } = usePreferences();
  const { user } = useAuth();
  const [todayCount, setTodayCount] = useState(0); // Replace with actual data
  const [showTip, setShowTip] = useState(true);
  const [streakDays, setStreakDays] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [todayLogs, setTodayLogs] = useState([]);

  useEffect(() => {
    const fetchTodayLogs = async () => {
      setIsLoading(true);
      try {
        const logs = await cigaretteLogService.getTodayLogs(user?.uid);
        setTodayLogs(logs);
        setTodayCount(logs.length);
      } catch (error) {
        console.error("Error fetching today's logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodayLogs();
  }, [user?.uid]);

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
          <Text style={styles.titleText}>Summary</Text>
        </View>
        <View style={styles.headerRightContainer}>
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
          onPress={() => navigation.navigate("Cigarette Logs")}
        />
        <View style={styles.boxContainer}>
          <TouchableBox
            title="Smoking Overview"
            subtitle="Track daily, weekly & monthly patterns"
            icon="stats-chart-outline"
            onPress={() => navigation.navigate("Detailed Cigarettes")}
            height={100}
          />
          <TouchableBox
            title="My Device"
            subtitle="Connect or manage your tracker"
            icon="watch-outline"
            onPress={() => navigation.navigate("My Device")}
            height={100}
          />

          <TouchableBox
            title="Achievements"
            subtitle="Celebrate your smoke-free wins"
            icon="trophy-outline"
            onPress={() => navigation.navigate("Achievements")}
            height={100}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SummaryScreen;
