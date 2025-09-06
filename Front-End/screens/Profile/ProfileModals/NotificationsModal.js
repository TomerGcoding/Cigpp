import { View, Text, StyleSheet, Switch } from "react-native";
import { COLOR, FONT } from "../../../constants/theme";
import { usePreferences } from "../../../contexts/PreferencesContext";
import { Ionicons } from "react-native-vector-icons";

const NotificationsModal = () => {
  const { preferences, updatePreference } = usePreferences();

  const toggleSwitch = () =>
    updatePreference("enableNotifications", !preferences.enableNotifications);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.switchContainer}>
          <View style={styles.switchInfo}>
            <Ionicons
                name="notifications-outline"
                size={24}
                color={COLOR.primary}
            />
            <View style={styles.textContainer}>
              <Text style={styles.switchText}>Allow Notifications</Text>
              <Text style={styles.description}>
                Get reminders and updates to stay on track
              </Text>
            </View>
          </View>
          <Switch
              trackColor={{ false: COLOR.background, true: COLOR.primary }}
              thumbColor={preferences.enableNotifications ? "#fff" : "#ddd"}
              onValueChange={toggleSwitch}
              value={preferences.enableNotifications}
          />
        </View>
      </View>

      <View style={[styles.card, styles.infoCard]}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle-outline" size={20} color={COLOR.primary} />
          <Text style={styles.infoTitle}>About Notifications</Text>
        </View>
        <Text style={styles.infoText}>
          Notifications help you stay consistent with your goals. You can adjust your device's notification settings anytime.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    padding: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: COLOR.lightBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  switchText: {
    color: COLOR.primary,
    fontFamily: FONT.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: COLOR.subPrimary,
    fontFamily: FONT.regular,
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: COLOR.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: COLOR.primary,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    color: COLOR.primary,
    fontFamily: FONT.bold,
    fontSize: 14,
    marginLeft: 8,
  },
  infoText: {
    color: COLOR.primary,
    fontFamily: FONT.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});


export default NotificationsModal;
