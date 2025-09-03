import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
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
import CigaretteDataManager from "../../services/CigaretteDataManager";

const SummaryScreen = () => {
  const navigation = useNavigation();
  const { preferences } = usePreferences();
  const { user } = useAuth();
  const [todayCount, setTodayCount] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [streakDays, setStreakDays] = useState(0); // Keep hardcoded for now
  const [todayLogs, setTodayLogs] = useState([]);
  const [syncStatus, setSyncStatus] = useState({});

  // Initialize data manager when user changes
  useEffect(() => {
    if (user?.uid) {
      CigaretteDataManager.initialize(user.uid);
    } else {
      CigaretteDataManager.cleanup();
    }
  }, [user?.uid]);

  // Load today's data from local storage (instant)
  const loadTodayData = useCallback(async () => {
    try {
      const logs = await CigaretteDataManager.getTodayLogs();
      setTodayLogs(logs);
      setTodayCount(logs.length);
      console.log("Today's logs loaded from local:", logs.length);
    } catch (error) {
      console.error("Error loading today's data:", error);
      setTodayLogs([]);
      setTodayCount(0);
    }
  }, []);

  // Load sync status
  const loadSyncStatus = useCallback(async () => {
    try {
      const status = await CigaretteDataManager.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error("Error loading sync status:", error);
    }
  }, []);

  // Listen to data changes from the data manager
  useEffect(() => {
    const unsubscribe = CigaretteDataManager.addListener((event, data) => {
      console.log('SummaryScreen received event:', event, data);
      
      // Reload data when local data changes
      if (event === 'log_added' || event === 'log_deleted' || event === 'data_merged') {
        loadTodayData();
      }
      
      // Update sync status
      if (event.startsWith('sync_')) {
        loadSyncStatus();
      }
    });

    return unsubscribe;
  }, [loadTodayData, loadSyncStatus]);

  // Load initial data when component mounts or user changes
  useEffect(() => {
    if (user?.uid) {
      loadTodayData();
      loadSyncStatus();
    }
  }, [user?.uid, loadTodayData, loadSyncStatus]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        loadTodayData();
        loadSyncStatus();
      }
    }, [user?.uid, loadTodayData, loadSyncStatus])
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

  // Get sync status indicator
  const getSyncStatusIcon = () => {
    if (syncStatus.isSyncing) {
      return { name: "sync", color: COLOR.orange };
    } else if (!syncStatus.isOnline) {
      return { name: "cloud-offline", color: COLOR.red };
    } else if (syncStatus.stats?.pending > 0) {
      return { name: "time-outline", color: COLOR.orange };
    } else {
      return { name: "cloud-done", color: COLOR.green };
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
          {/* Sync Status Indicator */}
          <TouchableOpacity 
            onPress={async () => {
              try {
                await CigaretteDataManager.forceSync();
              } catch (error) {
                Alert.alert("Sync Error", error.message);
              }
            }}
            style={{ marginRight: 10 }}
          >
            <Ionicons 
              name={getSyncStatusIcon().name}
              size={24}
              color={getSyncStatusIcon().color}
            />
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
