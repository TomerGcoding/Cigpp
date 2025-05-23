import React, { useState } from "react";
import { SafeAreaView, Text, View, TextInput, ScrollView } from "react-native";
import { styles } from "./ChallengesStyle";
import CustomButton from "../../components/CustomButton";
import { COLOR } from "../../constants/theme";
import { Ionicons } from "react-native-vector-icons";

const CreateChallengeScreen = ({ navigation }) => {
  const [challengeName, setChallengeName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create Challenge</Text>
        <Text style={styles.subHeaderText}>Step 1: Basic Info</Text>
      </View>

      <ScrollView>
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Challenge Name</Text>
          <TextInput
            style={{
              backgroundColor: COLOR.white,
              borderRadius: 10,
              padding: 12,
              fontFamily: "MontserratRegular",
              fontSize: 16,
              marginBottom: 20,
            }}
            placeholder="Enter a name for your challenge"
            value={challengeName}
            onChangeText={setChallengeName}
          />

          <Text style={styles.inputLabel}>Description (optional)</Text>
          <TextInput
            style={{
              backgroundColor: COLOR.white,
              borderRadius: 10,
              padding: 12,
              fontFamily: "MontserratRegular",
              fontSize: 16,
              height: 100,
              textAlignVertical: "top",
            }}
            placeholder="Describe your challenge"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.navigationButtons}>
          <CustomButton
            title="Cancel"
            style={[styles.backButton, { backgroundColor: COLOR.orange }]}
            onPress={() => navigation.goBack()}
          />
          <CustomButton
            title="Next"
            style={styles.nextButton}
            disabled={!challengeName.trim()}
            onPress={() => {
              navigation.navigate("ChallengeTimeFrame", {
                challengeName,
                description,
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateChallengeScreen;
