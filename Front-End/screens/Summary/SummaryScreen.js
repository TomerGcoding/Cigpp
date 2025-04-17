import React, { useState } from "react";
import { View, Text, Touchable, TouchableOpacity, Modal } from "react-native";
import styles from "./SummaryStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import TouchableBox from "../../components/TouchableBox";
import { COLOR } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@react-navigation/elements";
import CustomClickableIcon from "../../components/CustomClickableIcon";

const SummaryScreen = () => {
  const navigation = useNavigation();
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
        <TouchableBox
          title="Tracket Cigarettes"
          subtitle="Today: 0"
          onPress={() =>
            navigation.navigate("Summary", { screen: "TrackedCigarettes" })
          }
          width="90%"
          height={150}
        />
        <TouchableBox
          title="This Week"
          subtitle="Today: 38"
          icon="flame-outline"
          onPress={() => console.log("Bechki Pressed")}
          width={"90%"}
          height={150}
        />
        <View style={styles.touchableBoxContainer}>
          <TouchableBox
            title="My Device"
            icon="watch-outline"
            onPress={() => console.log("My Device Pressed")}
            width={"42%"}
            height={150}
          />
          <TouchableBox
            title="Awards"
            subtitle="March Challenge 2025"
            icon="trophy-outline"
            onPress={() => console.log("Awards Pressed")}
            width={"42%"}
            height={150}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SummaryScreen;
