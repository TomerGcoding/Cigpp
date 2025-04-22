import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR, FONT } from "../constants/theme";
import BTModal from "../screens/Profile/ProfileModals/BTModal";
import { useNavigation } from "@react-navigation/native";

const SettingsItem = ({ icon, title, hasChevron = true, onPress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>
        {hasChevron && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLOR.subPrimary}
            style={styles.chevron}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SettingsDivider = () => <View style={styles.divider} />;

const SettingsList = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <SettingsItem
        icon={
          <Ionicons name="bluetooth-outline" size={24} color={COLOR.primary} />
        }
        title="Connect Device"
        onPress={() => navigation.navigate("Bluetooth")}
      />
      <SettingsDivider />

      <SettingsItem
        icon={
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLOR.primary}
          />
        }
        title="Notificaions"
        onPress={() => navigation.navigate("Notifications")}
      />
      <SettingsDivider />

      <SettingsItem
        icon={
          <Ionicons name="create-outline" size={24} color={COLOR.primary} />
        }
        title="Change Goals"
        onPress={() => navigation.navigate("Change Goals")}
      />
      <SettingsDivider />

      <SettingsItem
        icon={
          <Ionicons name="person-outline" size={24} color={COLOR.primary} />
        }
        title="Personal Details"
        onPress={() => navigation.navigate("Personal Details")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c3cca8",
    borderRadius: 30,
    justifyContent: "center",
    width: "90%",
    height: "30%",
    marginTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: FONT.bold,
    color: COLOR.primary,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevron: {
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLOR.subPrimary,
    marginLeft: 66,
    opacity: 0.5,
  },
});

export default SettingsList;
