import React from "react";
import { View, Text, Image, TouchableNativeFeedback } from "react-native";
import styles from "./ProfileStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import { FIREBASE_AUTH } from "../../config/firebase/firebaseConfig";
import CustomClickableIcon from "../../components/CustomClickableIcon";
import { COLOR, FONT } from "../../constants/theme";
import SettingsList from "../../components/SettingsList";
import CustomButton from "../../components/CustomButton";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomClickableIcon
          name="settings-outline"
          onPress={() => console.log("Settings pressed")}
        ></CustomClickableIcon>
        <CustomClickableIcon
          name="chatbox-outline"
          onPress={() => console.log("Messages pressed")}
        ></CustomClickableIcon>
      </View>
      <View style={styles.userDetailesContainer}>
        <TouchableNativeFeedback onPress={() => console.log("Quack")}>
          <Image
            source={require("../../assets/icons/duck.png")}
            resizeMode="cover"
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              margin: 10,
            }}
          ></Image>
        </TouchableNativeFeedback>
        <Text
          style={{
            fontFamily: FONT.bold,
            color: COLOR.primary,
            fontSize: 30,
          }}
        >
          {user?.displayName.toUpperCase() || "Guest"}
        </Text>
      </View>
      <SettingsList />
      <CustomButton title={"Sign Out"} onPress={logout}></CustomButton>
    </SafeAreaView>
  );
};

export default ProfileScreen;
