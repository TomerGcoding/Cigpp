import React from "react";
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  Modal,
} from "react-native";
import styles from "./ProfileStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import CustomClickableIcon from "../../components/CustomClickableIcon";
import { COLOR, FONT } from "../../constants/theme";
import SettingsList from "../../components/SettingsList";
import CustomButton from "../../components/CustomButton";
import {usePreferences} from "../../contexts/PreferencesContext";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  let {preferences} = usePreferences();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userDetailsContainer}>
        <TouchableNativeFeedback onPress={() => console.log(preferences)}>
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
      <CustomButton
        title={"Sign Out"}
        onPress={() => logout()}
        style={{ margin: 20 }}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
