import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "./ChallengesStyle";
import { challengeTypes } from "./mockData";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "react-native-vector-icons";
import { COLOR } from "../../constants/theme";

const ChallengeTypeScreen = ({ navigation, route }) => {
  const { challengeName, description, timeFrame, timeFrameDays } = route.params;
  const [selectedType, setSelectedType] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create Challenge</Text>
        <Text style={styles.subHeaderText}>Step 3: Challenge Type</Text>
      </View>

      <ScrollView>
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Select Challenge Type</Text>
          {challengeTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.ruleTypeContainer,
                selectedType === type.id && styles.selectedRuleType,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Text style={styles.ruleTypeTitle}>{type.title}</Text>
              <Text style={styles.ruleTypeDescription}>{type.description}</Text>
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
            disabled={!selectedType}
            onPress={() => {
              const selectedTypeObj = challengeTypes.find(
                (type) => type.id === selectedType
              );
              navigation.navigate("ChallengeSummary", {
                challengeName,
                description,
                timeFrame,
                timeFrameDays,
                challengeType: selectedType,
                challengeTypeName: selectedTypeObj.title,
                challengeTypeRules: selectedTypeObj.rules,
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengeTypeScreen;
