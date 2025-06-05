import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
  const [todayCount, setTodayCount] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [streakDays, setStreakDays] = useState(3); // Keep hardcoded for now
  const [isLoading, setIsLoading] = useState(false);
  const [todayLogs, setTodayLogs] = useState([]);

  // Fetch today's logs function
  const fetchTodayLogs = useCallback(async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const logs = await cigaretteLogService.getTodayLogs(user.uid);
      setTodayLogs(logs);
      setTodayCount(logs.length);
      console.log("Today's logs fetched:", logs.length);
    } catch (error) {
      console.error("Error fetching today's logs:", error);
      setTodayLogs([]);
      setTodayCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  // Load data on component mount and when user changes
  useEffect(() => {
    if (user?.uid) {
      fetchTodayLogs();
    }
  }, [user?.uid, fetchTodayLogs]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        fetchTodayLogs();
      }
    }, [user?.uid, fetchTodayLogs])
  );

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (preferences.targetConsumption === 0) {
      return "Set your daily target in settings to track progress.";
    }

    const ratio = todayCount / preferences.targetConsumption;

    if (ratio >= 1.5) {
      return `You've exceeded your limit significantly. Consider taking a break.`;
    } else if (ratio >= 1) {
      return "You've reached your daily limit. Consider taking a break.";
    } else if (ratio >= 0.75) {
      return "You're approaching your daily limit. Try to pace yourself.";
    } else if (streakDays >= 3) {
      return `Great job! ${streakDays} days of staying under your limit.`;
    } else if (todayCount === 0) {
      return "Perfect start to the day! Keep it up.";
    } else {
      return "You're doing well today. Keep it up!";
    }
  };

  const handleAddCigarette = () => {
    const newLog = {
      userId: user?.uid,
      description: "Manual",
      date: new Date().toISOString(),
    };

    fetch("http://10.100.102.4:8080/api/cigarettes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLog),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Cigarette added:", data);
        setTodayCount(todayCount + 1); // Update today's count
      })
      .catch((error) => {
        console.error("Error adding cigarette:", error);
      });
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
        <CustomButton title={"add cigarette"} onPress={handleAddCigarette} />
      </View>
    </ScrollView>
  );
};

export default SummaryScreen;
