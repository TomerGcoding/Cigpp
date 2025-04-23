import React, { useState, useContext } from "react";
import { View, Text, Touchable, TouchableOpacity, Modal } from "react-native";
import styles from "./SummaryStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import TouchableBox from "../../components/TouchableBox";
import { COLOR } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import CustomClickableIcon from "../../components/CustomClickableIcon";
import ProgressCircleCard from "../../components/ProgressCircleCard";
import { usePreferences } from "../../contexts/PreferencesContext";

const SummaryScreen = () => {
  const navigation = useNavigation();
  const { preferences } = usePreferences();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
          <Text style={styles.titleText}>Summary</Text>
        </View>
        <CustomClickableIcon
          onPress={() => navigation.navigate("Profile")}
          color={COLOR.primary}
          size={40}
          name={"person-circle-outline"}
        ></CustomClickableIcon>
      </View>
      <View style={styles.boxContainer}>
        <ProgressCircleCard
          total={7}
          limit={preferences.targetConsumption}
          onPress={() => console.log("Progress Circle Card Pressed")}
          //limit={userData?.goals?.dailyLimit || 0}
        />
        <TouchableBox
          title="This Week"
          subtitle="Today: 38"
          icon="flame-outline"
          onPress={() => console.log("Bechki Pressed")}
          height={150}
        />
        <View style={styles.touchableBoxContainer}>
          <TouchableBox
            title="My Device"
            icon="watch-outline"
            onPress={() => console.log("My Device Pressed")}
            width={"48%"}
            height={150}
          />
          <TouchableBox
            title="Awards"
            subtitle="March Challenge 2025"
            icon="trophy-outline"
            onPress={() => console.log("Awards Pressed")}
            width={"48%"}
            height={150}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SummaryScreen;
