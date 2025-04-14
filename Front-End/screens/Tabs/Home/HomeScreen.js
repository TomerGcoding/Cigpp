import React from "react";
import { View, Text } from "react-native";
import styles from "./HomeStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../../config/firebase/firebaseConfig";
import CustomButton from "../../../components/CustomButton";

const HomeScreen = () => {
  const auth = FIREBASE_AUTH;

  const handleSignOut = () => {
    auth.signOut().catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomButton title={"Sign Out"} onPress={handleSignOut}></CustomButton>
    </SafeAreaView>
  );
};
export default HomeScreen;
