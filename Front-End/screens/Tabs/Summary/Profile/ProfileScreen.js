import React from "react";
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import styles from "./ProfileStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Summary", { screen: "SummaryMain" })
          }
        >
          <Ionicons name="arrow-back" size={24} color="#50C878" />
        </TouchableOpacity>
        <View>
          <Text style={styles.titleText}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
