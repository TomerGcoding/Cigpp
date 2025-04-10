import React from "react";
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import styles from "./SummaryStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";

const SummaryScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
          <Text style={styles.titleText}>Summary</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Summary", { screen: "Profile" })}
        >
          <Ionicons name="person-circle-outline" size={40} color="#50C878" />
        </TouchableOpacity>
      </View>
      <View style={styles.touchableTiles}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Summary", { screen: "TrackedCigarettes" })
          }
        >
          <Text style={styles.titleText}>Tracked Cigarettes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default SummaryScreen;
