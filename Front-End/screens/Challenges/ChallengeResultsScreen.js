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

const ChallengeResultsScreen = ({ navigation, route }) => {
  const { challengeId } = route.params;
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundChallenge = mockChallenges.find((c) => c.id === challengeId);
    setChallenge(foundChallenge);
  }, [challengeId]);

  const shareResults = async () => {
    try {
      const message =
        challenge.winner === "You"
          ? `I won the "${challenge.title}" challenge on Cig++! 🏆`
          : `I just completed the "${challenge.title}" challenge on Cig++. ${challenge.winner} was the winner!`;

      await Share.share({
        message,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share the results");
    }
  };

  const startSimilarChallenge = () => {
    // In a real app, this would pre-fill the challenge creation form with similar values
    navigation.navigate("CreateChallenge", {
      similarTo: challenge.title,
      timeFrame: challenge.timeFrame,
      type: challenge.type,
    });
  };

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noChallengesContainer}>
          <Text>Loading challenge results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get your data from the leaderboard
  const yourData = challenge.leaderboard.find((p) => p.name === "You");
  const yourRank = challenge.leaderboard.findIndex((p) => p.name === "You") + 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.congratsContainer}>
          <Ionicons
            name="trophy"
            size={80}
            color={challenge.winner === "You" ? COLOR.orange : COLOR.primary}
          />
          <Text style={styles.congratsText}>Challenge Complete!</Text>
          <Text style={styles.headerText}>{challenge.title}</Text>

          <View style={{ marginVertical: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "MontserratRegular",
                textAlign: "center",
              }}
            >
              Winner
            </Text>
            <Text style={styles.winnerName}>
              {challenge.winner}
              {challenge.winner === "You" && " 🎉"}
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Challenge Details</Text>
            <Text style={styles.summaryValue}>{challenge.typeName}</Text>
            <Text style={styles.summaryValue}>{challenge.timeFrame}</Text>
            <Text style={styles.summaryValue}>
              Participants: {challenge.participants}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.inputLabel}>Your Performance</Text>

            <View style={styles.statContainer}>
              <Text style={styles.statTitle}>Final Rank</Text>
              <Text style={styles.statValue}>
                #{yourRank} out of {challenge.participants}
              </Text>
            </View>

            <View style={styles.statContainer}>
              <Text style={styles.statTitle}>
                {challenge.type === 1
                  ? "Total Cigarettes Smoked"
                  : "Total Points Earned"}
              </Text>
              <Text style={styles.statValue}>
                {challenge.type === 1 ? yourData.cigSmoked : yourData.points}
              </Text>
            </View>

            {challenge.type === 1 && (
              <View style={styles.statContainer}>
                <Text style={styles.statTitle}>Cigarettes Saved</Text>
                <Text style={styles.statValue}>
                  {Math.max(
                    0,
                    challenge.personalProgress.personalTarget *
                      (challenge.timeFrame === "1 Week"
                        ? 7
                        : challenge.timeFrame === "2 Weeks"
                        ? 14
                        : 30) -
                      yourData.cigSmoked
                  )}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.leaderboard}>
            <Text style={styles.leaderboardTitle}>Final Leaderboard</Text>

            {challenge.leaderboard.map((participant, index) => (
              <View
                key={index}
                style={[
                  styles.participantCard,
                  index === 0 && {
                    backgroundColor: COLOR.lightBackground,
                    borderWidth: 2,
                    borderColor: COLOR.orange,
                  },
                ]}
              >
                <Text style={styles.rankNumber}>#{index + 1}</Text>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {participant.name}
                    {index === 0 && " 👑"}
                  </Text>
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
        </View>

        <View style={{ marginVertical: 20 }}>
          <CustomButton
            title="Share Results"
            style={[styles.createButton, { backgroundColor: COLOR.primary }]}
            onPress={shareResults}
          />

          <CustomButton
            title="Start Similar Challenge"
            style={[styles.createButton, { backgroundColor: COLOR.lightblue }]}
            onPress={startSimilarChallenge}
          />

          <CustomButton
            title="Back to Challenges"
            style={[styles.createButton, { backgroundColor: COLOR.orange }]}
            onPress={() => navigation.navigate("ChallengesHome")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengeResultsScreen;
