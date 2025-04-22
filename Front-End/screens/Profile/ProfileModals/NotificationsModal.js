import { View, Text, StyleSheet, Switch } from "react-native";
import { COLOR, FONT } from "../../../constants/theme";
import { useState } from "react";

const NotificationsModal = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Allow Notificaions</Text>
        <Switch
          trackColor={{ false: COLOR.background, true: COLOR.primary }}
          thumbColor={isEnabled ? COLOR.primary : COLOR.background}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <Text style={styles.description}>
        Turn on notifications to enhance your experience.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    alignItems: "center",
  },
  switchContainer: {
    backgroundColor: COLOR.lightBackground,
    padding: 15,
    width: "100%",
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchText: {
    color: COLOR.primary,
    fontFamily: FONT.bold,
    fontSize: 16,
  },
  description: {
    color: COLOR.subPrimary,
    fontFamily: FONT.regular,
    margin: 10,
    fontSize: 12,
  },
});

export default NotificationsModal;
