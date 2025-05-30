import React, { useState } from "react";
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

const SummaryScreen = () => {
  const navigation = useNavigation();
  const { preferences } = usePreferences();
  const { user } = useAuth(); // Assuming you have a useAuth hook to get user data
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
          onPress={() => navigation.navigate("Detailed Cigarettes")}
        />

        {/* Navigation Boxes */}
        <View>
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
        <CustomButton title={"add cigarette"} onPress={handleAddCigarette} />
      </View>
    </ScrollView>
  );
};

export default SummaryScreen;
