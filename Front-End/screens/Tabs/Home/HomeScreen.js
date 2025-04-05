import React from "react";
import { View, Text } from "react-native";
import styles from "./HomeStyle";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text onPress={() => navigation.navigate("Login")}>Home Screen</Text>
    </SafeAreaView>
  );
};
export default HomeScreen;
