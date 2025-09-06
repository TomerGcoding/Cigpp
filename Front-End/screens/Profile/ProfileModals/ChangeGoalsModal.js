import { View, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { COLOR, FONT } from "../../../constants/theme";
import { usePreferences } from "../../../contexts/PreferencesContext";
import CustomClickableIcon from "../../../components/CustomClickableIcon";
import CustomButton from "../../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";

const ChangeGoalsModal = ({ navigation }) => {
  const { preferences, updatePreference } = usePreferences();
  const [adjustedTarget, setAdjustedTarget] = useState(
      preferences.targetConsumption
  );

  const handleChangeGoals = () => {
    updatePreference("targetConsumption", adjustedTarget);
    navigation.goBack();
  };

  return (
      <View style={styles.container}>
        {/* Header Card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Daily Target</Text>
            <Text style={styles.subTitle}>
              Set a target based on how many cigarettes you allow yourself, each day.
            </Text>
          </View>
        </View>

        {/* Target Selector Card */}
        <View style={styles.card}>
          <View style={styles.targetContainer}>
            <CustomClickableIcon
                name="remove-circle"
                size={48}
                onPress={() =>
                    adjustedTarget > 0 ? setAdjustedTarget(adjustedTarget - 1) : null
                }
            />
            <Text style={styles.target}>{adjustedTarget}</Text>
            <CustomClickableIcon
                name="add-circle"
                size={48}
                onPress={() => setAdjustedTarget(adjustedTarget + 1)}
            />
          </View>
          <Text style={styles.cigarettes}>CIGARETTES/DAY</Text>
        </View>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <CustomButton
              title="Change Goals"
              onPress={handleChangeGoals}
              style={styles.button}
          />
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
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginTop: 8,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
    textAlign: "center",
    lineHeight: 20,
  },
  targetContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  target: {
    fontSize: 48,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginHorizontal: 40,
  },
  cigarettes: {
    fontSize: 14,
    fontFamily: FONT.bold,
    color: COLOR.subPrimary,
    letterSpacing: 1,
  },
  actionSection: {
    marginTop: 20,
  },
  button: {
    width: "100%",
  },
});

export default ChangeGoalsModal;