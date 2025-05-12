import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import CustomClickableIcon from "../../../components/CustomClickableIcon";
import { COLOR, FONT } from "../../../constants/theme";

// Sample achievement data - replace with your actual achievements
const achievementsData = [
  {
    id: "1",
    title: "Clean Day",
    description: "A full day without smoking",
    icon: "leaf-outline",
    unlocked: true,
    date: "2024-03-15",
    progress: 1,
    total: 1,
  },
  {
    id: "2",
    title: "Balanced Week",
    description: "7 consecutive days below your daily target",
    icon: "calendar-outline",
    unlocked: false,
    progress: 5,
    total: 7,
  },
  {
    id: "3",
    title: "Significant Reduction",
    description: "Reduced your daily cigarette count by 50%",
    icon: "trending-down-outline",
    unlocked: true,
    date: "2024-03-10",
    progress: 1,
    total: 1,
  },
  {
    id: "4",
    title: "Money Saver",
    description: "Saved $100 on cigarette expenses",
    icon: "wallet-outline",
    unlocked: false,
    progress: 64,
    total: 100,
  },
  {
    id: "5",
    title: "Consistent Tracker",
    description: "30 days of continuous tracking",
    icon: "trophy-outline",
    unlocked: false,
    progress: 12,
    total: 30,
  },
  {
    id: "6",
    title: "Weekend Warrior",
    description: "A Saturday without smoking",
    icon: "sunny-outline",
    unlocked: false,
    progress: 0,
    total: 1,
  },
  {
    id: "7",
    title: "Good Start",
    description: "Logged your first cigarette",
    icon: "flag-outline",
    unlocked: true,
    date: "2024-02-28",
    progress: 1,
    total: 1,
  },
  {
    id: "8",
    title: "Master Achiever",
    description: "Complete all other achievements",
    icon: "star-outline",
    unlocked: false,
    progress: 3,
    total: 7,
  },
];

const AchievementsModal = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("all");

  // Filter achievements based on active tab
  const filteredAchievements = () => {
    if (activeTab === "completed") {
      return achievementsData.filter((achievement) => achievement.unlocked);
    } else if (activeTab === "inProgress") {
      return achievementsData.filter(
        (achievement) => !achievement.unlocked && achievement.progress > 0
      );
    } else if (activeTab === "locked") {
      return achievementsData.filter(
        (achievement) => !achievement.unlocked && achievement.progress === 0
      );
    }
    return achievementsData;
  };

  // Calculate overall achievement progress
  const overallProgress = () => {
    const completed = achievementsData.filter((a) => a.unlocked).length;
    return {
      completed,
      total: achievementsData.length,
      percentage: Math.round((completed / achievementsData.length) * 100),
    };
  };

  const progress = overallProgress();

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const renderAchievementItem = ({ item }) => {
    const progressPercentage = Math.min(
      100,
      Math.round((item.progress / item.total) * 100)
    );

    return (
      <View
        style={[
          styles.achievementCard,
          !item.unlocked && styles.achievementCardLocked,
        ]}
      >
        <View style={styles.achievementHeader}>
          <View
            style={[
              styles.achievementIconContainer,
              item.unlocked ? styles.achievementIconContainerUnlocked : null,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={26}
              color={item.unlocked ? "#FFFFFF" : COLOR.primary}
            />
          </View>

          <View style={styles.achievementTitleContainer}>
            <Text style={styles.achievementTitle}>{item.title}</Text>
            <Text style={styles.achievementDescription}>
              {item.description}
            </Text>
          </View>

          {item.unlocked ? (
            <View style={styles.achievementCompletedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={COLOR.primary}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.achievementProgressContainer}>
          <View style={styles.achievementProgressBar}>
            <View
              style={[
                styles.achievementProgressFill,
                { width: `${progressPercentage}%` },
                item.unlocked && styles.achievementProgressFillComplete,
              ]}
            />
          </View>

          <Text style={styles.achievementProgressText}>
            {item.unlocked
              ? `Completed on ${formatDate(item.date)}`
              : `${item.progress}/${item.total} (${progressPercentage}%)`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomClickableIcon
          onPress={() => navigation.goBack()}
          color={COLOR.primary}
          size={30}
          name="arrow-back"
        />
        <Text style={styles.title}>Achievements</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Overall Progress */}
      <View style={styles.overallContainer}>
        <View style={styles.progressCircleContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercentage}>
              {progress.percentage}%
            </Text>
          </View>
        </View>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <Text style={styles.progressDetails}>
            Completed {progress.completed} out of {progress.total} achievements
          </Text>
          {progress.completed === progress.total ? (
            <Text style={styles.congratsText}>
              Congratulations! You've completed all achievements!
            </Text>
          ) : (
            <Text style={styles.encouragementText}>
              Keep it up! You're on the right track.
            </Text>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {[
          { id: "all", label: "All" },
          { id: "completed", label: "Completed" },
          { id: "inProgress", label: "In Progress" },
          { id: "locked", label: "Locked" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Achievement List */}
      <FlatList
        data={filteredAchievements()}
        renderItem={renderAchievementItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={60} color="#d0d0d0" />
            <Text style={styles.emptyText}>
              No achievements in this category
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  overallContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: COLOR.lightBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressCircleContainer: {
    marginRight: 15,
  },
  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercentage: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  progressTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 5,
  },
  progressDetails: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
    marginBottom: 5,
  },
  congratsText: {
    fontSize: 14,
    fontFamily: FONT.semiBold,
    color: "#2ecc71",
  },
  encouragementText: {
    fontSize: 14,
    fontFamily: FONT.semiBold,
    color: COLOR.primary,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 25,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: COLOR.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONT.medium,
    color: COLOR.primary,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  achievementCard: {
    backgroundColor: COLOR.lightBackground,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementCardLocked: {
    opacity: 0.8,
  },
  achievementHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  achievementIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  achievementIconContainerUnlocked: {
    backgroundColor: COLOR.primary,
  },
  achievementTitleContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
  },
  achievementCompletedBadge: {
    marginLeft: 10,
    alignSelf: "center",
  },
  achievementProgressContainer: {
    marginTop: 5,
  },
  achievementProgressBar: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 5,
  },
  achievementProgressFill: {
    height: 8,
    backgroundColor: COLOR.subPrimary,
    borderRadius: 4,
  },
  achievementProgressFillComplete: {
    backgroundColor: COLOR.primary,
  },
  achievementProgressText: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: COLOR.subPrimary,
    textAlign: "left",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONT.semiBold,
    color: COLOR.subPrimary,
    marginTop: 10,
  },
});

export default AchievementsModal;
