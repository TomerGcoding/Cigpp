import React from "react";
import { View, Text } from "react-native";
import styles from "./HomeStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../../config/firebase/firebaseConfig";
import { Button } from "@react-navigation/elements";

const HomeScreen = ({ navigation }) => {
  const auth = FIREBASE_AUTH;

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={handleSignOut}>Sign Out</Button>
      <Text
        onPress={() => {
          console.log(auth.currentUser.displayName);
        }}
      >
        {"Hello " + auth.currentUser.displayName}
      </Text>
      <Button onPress={() => navigation.navigate("Login")}>
        Back to login
      </Button>
    </SafeAreaView>
  );
};
export default HomeScreen;
