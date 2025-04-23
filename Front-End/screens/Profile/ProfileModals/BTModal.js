import { View, Text, StyleSheet, Switch } from "react-native";
import { COLOR, FONT } from "../../../constants/theme";
import { usePreferences } from "../../../contexts/PreferencesContext";

const BTModal = () => {
  const { preferences, updatePreference } = usePreferences();
  const toggleSwitch = () =>
    updatePreference("enableBluetooth", !preferences.enableBluetooth);
  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Connect Bluetooth</Text>
        <Switch
          trackColor={{ false: COLOR.background, true: COLOR.primary }}
          thumbColor={preferences.enableBluetooth ? "#fff" : "#ddd"}
          onValueChange={toggleSwitch}
          value={preferences.enableBluetooth}
        />
      </View>
      <Text style={styles.description}>
        Turn on Bluetooth to connect with you Cig++ smart case.
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

export default BTModal;
