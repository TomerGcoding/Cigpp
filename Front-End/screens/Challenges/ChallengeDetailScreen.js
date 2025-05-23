import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import { styles } from "./ChallengesStyle";
import { mockChallenges } from "./mockData";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "react-native-vector-icons";
import { COLOR } from "../../constants/theme";

const ChallengeDetailScreen = ({ navigation, route }) => {
  const { challengeId } = route.params;
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundChallenge = mockChallenges.find((c) => c.id === challengeId);
    setChallenge(foundChallenge);
  }, [challengeId]);

  const shareChallenge = async () => {
    try {
      await Share.share({
        message: `Join me in the "${challenge.title}" challenge on Cig++! We're competing to smoke less.`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share the challenge");
    }
  };

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noChallengesContainer}>
          <Text>Loading challenge details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCreator = challenge.creator === "You";
  const daysLeft =
    challenge.status === "upcoming"
      ? "Starts soon"
      : challenge.status === "completed"
      ? "Completed"
      : "5 days left"; // In a real app, calculate this dynamically

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ position: "absolute", left: 0, paddingVertical: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLOR.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{challenge.title}</Text>
      </View>

      <ScrollView>
        <View style={styles.formContainer}>
          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Challenge Type</Text>
            <Text style={styles.summaryValue}>{challenge.typeName}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Time Frame</Text>
            <Text style={styles.summaryValue}>{challenge.timeFrame}</Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  fontSize: 14,
                  color:
                    challenge.status === "active" ? COLOR.green : COLOR.orange,
                },
              ]}
            >
              {daysLeft}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Creator</Text>
            <Text style={styles.summaryValue}>{challenge.creator}</Text>
          </View>

          {challenge.status === "active" && challenge.joined && (
            <View style={styles.summarySection}>
              <Text style={styles.inputLabel}>Your Progress</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: 10,
                }}
              >
                {challenge.type === 1 ? (
                  <View style={styles.metricContainer}>
                    <Text style={styles.metricValue}>
                      {challenge.personalProgress.cigSmoked}
                    </Text>
                    <Text style={styles.metricLabel}>Cigarettes Smoked</Text>
                  </View>
                ) : (
                  <View style={styles.metricContainer}>
                    <Text style={styles.metricValue}>
                      {challenge.personalProgress.points}
                    </Text>
                    <Text style={styles.metricLabel}>Points</Text>
                  </View>
                )}

                <View style={styles.metricContainer}>
                  <Text style={styles.metricValue}>
                    #{challenge.personalProgress.currentRank}
                  </Text>
                  <Text style={styles.metricLabel}>Current Rank</Text>
                </View>

                {challenge.type === 2 && (
                  <View style={styles.metricContainer}>
                    <Text style={styles.metricValue}>
                      {challenge.personalProgress.personalTarget}
                    </Text>
                    <Text style={styles.metricLabel}>Daily Target</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {challenge.status !== "upcoming" && (
            <View style={styles.leaderboard}>
              <Text style={styles.leaderboardTitle}>Leaderboard</Text>

              {challenge.leaderboard.map((participant, index) => (
                <View key={index} style={styles.participantCard}>
                  <Text style={styles.rankNumber}>#{index + 1}</Text>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{participant.name}</Text>
                    <Text style={styles.userStats}>
                      {challenge.type === 1
                        ? `${participant.cigSmoked} cigarettes smoked`
                        : `${participant.points} points`}
                    </Text>
                  </View>
                  {participant.name === "You" && (
                    <Ionicons
                      name="person-circle"
                      size={24}
                      color={COLOR.primary}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ marginVertical: 20 }}>
          {challenge.status === "active" && !challenge.joined && (
            <CustomButton
              title="Join Challenge"
              style={[styles.createButton, { backgroundColor: COLOR.darkblue }]}
              onPress={() => {
                Alert.alert("Success", "You have joined the challenge!");
                navigation.navigate("ChallengesHome");
              }}
            />
          )}

          <CustomButton
            title="Share Challenge"
            style={[styles.createButton, { backgroundColor: COLOR.lightblue }]}
            onPress={shareChallenge}
          />

          {isCreator && challenge.status !== "completed" && (
            <CustomButton
              title="Invite More Friends"
              style={styles.createButton}
              onPress={() => {
                // In a real app, this would open an invitation screen
                Alert.alert(
                  "Invite",
                  "Invite friends functionality would go here"
                );
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengeDetailScreen;
