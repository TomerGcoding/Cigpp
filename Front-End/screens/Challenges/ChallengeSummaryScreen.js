import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
} from "react-native";
import { styles } from "./ChallengesStyle";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "react-native-vector-icons";
import { COLOR } from "../../constants/theme";

const ChallengeSummaryScreen = ({ navigation, route }) => {
  const {
    challengeName,
    description,
    timeFrame,
    timeFrameDays,
    challengeType,
    challengeTypeName,
    challengeTypeRules,
  } = route.params;

  const [isPublic, setIsPublic] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedFriends, setInvitedFriends] = useState([]);

  const addFriend = () => {
    if (!inviteEmail.trim()) return;

    // In a real app, you would validate the email format
    if (invitedFriends.includes(inviteEmail)) {
      Alert.alert("Already Invited", "This person has already been invited.");
      return;
    }

    setInvitedFriends([...invitedFriends, inviteEmail]);
    setInviteEmail("");
  };

  const createChallenge = () => {
    // In a real app, this would make an API call to create a challenge
    Alert.alert(
      "Challenge Created",
      "Your challenge has been created successfully!",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("ChallengesHome"),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create Challenge</Text>
        <Text style={styles.subHeaderText}>Final Review</Text>
      </View>

      <ScrollView>
        <View style={styles.formContainer}>
          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Challenge Name</Text>
            <Text style={styles.summaryValue}>{challengeName}</Text>
          </View>

          {description && (
            <View style={styles.summarySection}>
              <Text style={styles.inputLabel}>Description</Text>
              <Text style={styles.summaryValue}>{description}</Text>
            </View>
          )}

          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Time Frame</Text>
            <Text style={styles.summaryValue}>{timeFrame}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Challenge Type</Text>
            <Text style={styles.summaryValue}>{challengeTypeName}</Text>
            <Text
              style={[
                styles.summaryValue,
                { fontSize: 14, fontStyle: "italic" },
              ]}
            >
              {challengeTypeRules}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Visibility</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.summaryValue, { marginBottom: 0 }]}>
                {isPublic ? "Public" : "Private"}
              </Text>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: COLOR.lightblue, true: COLOR.primary }}
                thumbColor={COLOR.white}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                fontStyle: "italic",
                color: COLOR.subPrimary,
                marginTop: 5,
              }}
            >
              {isPublic
                ? "Anyone can join this challenge"
                : "Only invited users can join this challenge"}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Invite Friends (Optional)</Text>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <TextInput
                style={{
                  backgroundColor: COLOR.white,
                  borderRadius: 10,
                  padding: 12,
                  flex: 1,
                  fontFamily: "MontserratRegular",
                  fontSize: 16,
                }}
                placeholder="Enter email address"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={{
                  backgroundColor: COLOR.primary,
                  borderRadius: 10,
                  padding: 12,
                  marginLeft: 10,
                }}
                onPress={addFriend}
              >
                <Ionicons name="add" size={24} color={COLOR.white} />
              </TouchableOpacity>
            </View>

            {invitedFriends.map((friend, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  backgroundColor: COLOR.lightBackground,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 5,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontFamily: "MontserratRegular" }}>
                  {friend}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const updatedFriends = [...invitedFriends];
                    updatedFriends.splice(index, 1);
                    setInvitedFriends(updatedFriends);
                  }}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={COLOR.primary}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.navigationButtons}>
          <CustomButton
            title="Back"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
          <CustomButton
            title="Create Challenge"
            style={styles.nextButton}
            onPress={createChallenge}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengeSummaryScreen;
