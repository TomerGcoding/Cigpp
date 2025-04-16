import React from "react";
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import styles from "./ProfileStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { COLOR } from "../../constants/theme";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { FIREBASE_AUTH } from "../../config/firebase/firebaseConfig";
import CustomButton from "../../components/CustomButton";

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const auth = FIREBASE_AUTH;

  const handleSignOut = () => {
    auth.signOut().catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={24} color={COLOR.primary} />
      </TouchableOpacity>
      <Text>Welcome, {user?.displayName || "Guest"}</Text>
      <CustomButton title={"Sign Out"} onPress={handleSignOut}></CustomButton>
    </SafeAreaView>
  );
};

export default ProfileScreen;
