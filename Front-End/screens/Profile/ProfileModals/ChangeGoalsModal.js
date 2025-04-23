import { View, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { COLOR, FONT } from "../../../constants/theme";
import { usePreferences } from "../../../contexts/PreferencesContext";
import CustomClickableIcon from "../../../components/CustomClickableIcon";
import CustomButton from "../../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

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
      <View style={styles.header}>
        <Text style={styles.title}>Daily Target</Text>
        <Text style={styles.subTitle}>
          Set a target based on how many cigarettes you allow yourself, each
          day.
        </Text>
      </View>
      <View style={styles.targetContainer}>
        <CustomClickableIcon
          name={"remove-circle"}
          size={48}
          onPress={() =>
            adjustedTarget > 0 ? setAdjustedTarget(adjustedTarget - 1) : null
          }
        />
        <Text style={styles.target}>{adjustedTarget}</Text>
        <CustomClickableIcon
          name={"add-circle"}
          size={48}
          onPress={() => setAdjustedTarget(adjustedTarget + 1)}
        />
      </View>
      <Text style={styles.cigarettes}>CIGARETTES/DAY</Text>
      <CustomButton title={"Change Goals"} onPress={handleChangeGoals} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginVertical: 80,
    marginHorizontal: 50,
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: FONT.bold,
    color: "#fff",
  },
  subTitle: {
    fontSize: 16,
    fontFamily: FONT.regular,
    color: "#fff",
  },
  targetContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  target: {
    fontSize: 48,
    fontFamily: FONT.bold,
    color: "#fff",
    marginHorizontal: 50,
  },
  cigarettes: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: "#fff",
    marginBottom: 80,
  },
});

export default ChangeGoalsModal;
