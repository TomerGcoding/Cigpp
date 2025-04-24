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

const SummaryScreen = ({ navigation }) => {
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
          onPress={() => navigation.navigate("Detailed Cigarettes")}
        />
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
            icon="watch-outline"
            onPress={() => navigation.navigate("My Device")}
            width={"48%"}
            // height={150}
          />
          <TouchableBox
            title="Achievements"
            subtitle="View your milestones"
            icon="trophy-outline"
            onPress={() => navigation.navigate("Achievements")}
            width={"48%"}
            // height={150}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SummaryScreen;
