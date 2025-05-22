import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "./ChallengesStyle";
import { timeFrameOptions } from "./mockData";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "react-native-vector-icons";
import { COLOR } from "../../constants/theme";

const ChallengeTimeFrameScreen = ({ navigation, route }) => {
  const { challengeName, description } = route.params;
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create Challenge</Text>
        <Text style={styles.subHeaderText}>Step 2: Time Frame</Text>
      </View>

      <ScrollView>
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Select Challenge Duration</Text>
          {timeFrameOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.timeFrameOption,
                selectedTimeFrame === option.id && styles.selectedTimeFrame,
              ]}
              onPress={() => setSelectedTimeFrame(option.id)}
            >
              <Text style={styles.timeFrameText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navigationButtons}>
          <CustomButton
            title="Back"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
          <CustomButton
            title="Next"
            style={styles.nextButton}
            disabled={!selectedTimeFrame}
            onPress={() => {
              const selectedOption = timeFrameOptions.find(
                (option) => option.id === selectedTimeFrame
              );
              navigation.navigate("ChallengeType", {
                challengeName,
                description,
                timeFrame: selectedOption.label,
                timeFrameDays: selectedOption.value,
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengeTimeFrameScreen;
