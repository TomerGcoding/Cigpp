import React from "react";
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./TrackedCigarettesStyle";

const TrackedCigarettesScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("SummaryMain")}>
          <Ionicons name="arrow-back" size={30} color="#50C878" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Tracked Cigarettes</Text>
      </View>
      <View></View>
    </SafeAreaView>
  );
};

export default TrackedCigarettesScreen;
