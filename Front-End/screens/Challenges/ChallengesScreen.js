import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { usePreferences } from "../../contexts/PreferencesContext";
import { styles } from "./ChallengesStyle";
import { mockChallenges } from "./mockData";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "react-native-vector-icons";
import { COLOR } from "../../constants/theme";

const ChallengesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("active");

  // Filter challenges based on active tab
  const filteredChallenges = mockChallenges.filter((challenge) => {
    if (activeTab === "active")
      return challenge.status === "active" && challenge.joined;
    if (activeTab === "available")
      return challenge.status === "active" && !challenge.joined;
    if (activeTab === "completed") return challenge.status === "completed";
    return false;
  });

  const renderChallengeCard = ({ item }) => {
    const isActive = item.status === "active";
    const isCompleted = item.status === "completed";
    const isUpcoming = item.status === "upcoming";

    const statusBgColor = isActive
      ? COLOR.green
      : isCompleted
      ? COLOR.orange
      : COLOR.lightblue;

    return (
      <TouchableOpacity
        style={styles.challengeCard}
        onPress={() => {
          if (isCompleted) {
            navigation.navigate("ChallengeResults", { challengeId: item.id });
          } else {
            navigation.navigate("ChallengeDetail", { challengeId: item.id });
          }
        }}
      >
        <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>

        <Text style={styles.challengeTitle}>{item.title}</Text>
        <Text style={styles.challengeType}>Type: {item.typeName}</Text>
        <Text style={styles.challengeInfo}>Time Frame: {item.timeFrame}</Text>
        <Text style={styles.challengeInfo}>
          Participants: {item.participants}
        </Text>

        {isActive && item.joined && (
          <View style={styles.challengeMetrics}>
            {item.type === 1 ? (
              <View style={styles.metricContainer}>
                <Text style={styles.metricValue}>
                  {item.personalProgress.cigSmoked}
                </Text>
                <Text style={styles.metricLabel}>Cigarettes Smoked</Text>
              </View>
            ) : (
              <View style={styles.metricContainer}>
                <Text style={styles.metricValue}>
                  {item.personalProgress.points}
                </Text>
                <Text style={styles.metricLabel}>Points</Text>
              </View>
            )}

            <View style={styles.metricContainer}>
              <Text style={styles.metricValue}>
                #{item.personalProgress.currentRank}
              </Text>
              <Text style={styles.metricLabel}>Current Rank</Text>
            </View>
          </View>
        )}

        {!item.joined && !isCompleted && (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => {
              // In a real app, this would call an API to join the challenge
              alert("Joined the challenge successfully!");
              navigation.navigate("ChallengeDetail", { challengeId: item.id });
            }}
          >
            <Text style={styles.joinButtonText}>Join Challenge</Text>
          </TouchableOpacity>
        )}

        {(item.joined || isCompleted) && (
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => {
              if (isCompleted) {
                navigation.navigate("ChallengeResults", {
                  challengeId: item.id,
                });
              } else {
                navigation.navigate("ChallengeDetail", {
                  challengeId: item.id,
                });
              }
            }}
          >
            <Text style={styles.viewDetailsButtonText}>View Details</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.noChallengesContainer}>
      <Ionicons name="trophy-outline" size={60} color={COLOR.primary} />
      <Text style={styles.noChallengesText}>
        {activeTab === "active"
          ? "You're not in any active challenges yet."
          : activeTab === "available"
          ? "No available challenges to join right now."
          : activeTab === "completed"
          ? "You haven't completed any challenges yet."
          : "No upcoming challenges at the moment."}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Challenges</Text>
        <Text style={styles.subHeaderText}>
          Compete with friends to smoke less
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "available" && styles.activeTab]}
          onPress={() => setActiveTab("available")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "available" && styles.activeTabText,
            ]}
          >
            Available
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredChallenges}
        renderItem={renderChallengeCard}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{ flexGrow: 1 }}
      />

      <CustomButton
        title="Create New Challenge"
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateChallenge")}
      />
    </SafeAreaView>
  );
};

export default ChallengesScreen;
