import React, { useState, useEffect, useCallback } from "react";
import {
    SafeAreaView,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { COLOR, FONT } from "../../constants/theme";
import { styles } from "./ChallengesStyle";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "react-native-vector-icons";
import ChallengeService from "../../services/ChallengeService";

const ChallengesScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("active");
    const [challenges, setChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Load challenges based on active tab
    const loadChallenges = useCallback(async () => {
        if (!user?.uid) return;

        try {
            setIsLoading(true);
            let fetchedChallenges = [];

            switch (activeTab) {
                case "active":
                    fetchedChallenges = await ChallengeService.getUserActiveChallenges(user.uid);
                    break;
                case "available":
                    fetchedChallenges = await ChallengeService.getUserUpcomingChallenges(user.uid);
                    break;
                case "completed":
                    fetchedChallenges = await ChallengeService.getUserCompletedChallenges(user.uid);
                    break;
                default:
                    fetchedChallenges = [];
            }

            setChallenges(fetchedChallenges);
        } catch (error) {
            console.error("Error loading challenges:", error);
            Alert.alert("Error", "Failed to load challenges. Please try again.");
            setChallenges([]);
        } finally {
            setIsLoading(false);
        }
    }, [user?.uid, activeTab]);

    // Refresh challenges (pull to refresh)
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadChallenges();
        setRefreshing(false);
    }, [loadChallenges]);

    // Load challenges when component mounts or tab changes
    useEffect(() => {
        if (user?.uid) {
            loadChallenges();
        }
    }, [loadChallenges]);

    // Refresh challenges when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (user?.uid) {
                loadChallenges();
            }
        }, [user?.uid, loadChallenges])
    );

    // Handle joining a challenge
    const handleJoinChallenge = async (challengeId, challengeType) => {
        try {
            if (challengeType === "DAILY_TARGET_POINTS") {
                // For Daily Target Points challenges, we need to ask for personal target
                Alert.prompt(
                    "Set Personal Target",
                    "Enter your daily cigarette target for this challenge:",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Join",
                            onPress: async (target) => {
                                const personalTarget = parseInt(target);
                                if (isNaN(personalTarget) || personalTarget < 1) {
                                    Alert.alert("Invalid Target", "Please enter a valid number greater than 0.");
                                    return;
                                }

                                await ChallengeService.joinChallenge(challengeId, user.uid, personalTarget);
                                Alert.alert("Success", "You have joined the challenge!");
                                loadChallenges();
                            },
                        },
                    ],
                    "plain-text",
                    "",
                    "numeric"
                );
            } else {
                await ChallengeService.joinChallenge(challengeId, user.uid);
                Alert.alert("Success", "You have joined the challenge!");
                loadChallenges();
            }
        } catch (error) {
            console.error("Error joining challenge:", error);
            Alert.alert("Error", "Failed to join challenge. Please try again.");
        }
    };

    // Handle leaving a challenge
    const handleLeaveChallenge = async (challengeId) => {
        Alert.alert(
            "Leave Challenge",
            "Are you sure you want to leave this challenge?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Leave",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await ChallengeService.leaveChallenge(challengeId, user.uid);
                            Alert.alert("Success", "You have left the challenge.");
                            loadChallenges();
                        } catch (error) {
                            console.error("Error leaving challenge:", error);
                            Alert.alert("Error", "Failed to leave challenge. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    const renderChallengeCard = ({ item }) => {
        const isActive = item.status === "ACTIVE";
        const isCompleted = item.status === "COMPLETED";
        const isUpcoming = item.status === "UPCOMING";
        const isJoined = item.joined;

        const statusBgColor = isActive
            ? COLOR.green
            : isCompleted
                ? COLOR.orange
                : COLOR.lightblue;

        const challengeTypeName = ChallengeService.getChallengeTypeName(item.challengeType);
        const timeFrameText = ChallengeService.getTimeFrameText(item.timeFrameDays);
        const daysRemaining = ChallengeService.getDaysRemaining(item.endDate);

        return (
            <TouchableOpacity
                style={styles.challengeCard}
                onPress={() => {
                    navigation.navigate("ChallengeDetail", {
                        challengeId: item.challengeId,
                        challenge: item
                    });
                }}
            >
                <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>

                <Text style={styles.challengeTitle}>{item.title}</Text>
                <Text style={styles.challengeType}>Type: {challengeTypeName}</Text>
                <Text style={styles.challengeInfo}>Time Frame: {timeFrameText}</Text>
                <Text style={styles.challengeInfo}>
                    Participants: {item.participantCount}
                </Text>

                {isActive && (
                    <Text style={[styles.challengeInfo, { color: COLOR.orange }]}>
                        {daysRemaining}
                    </Text>
                )}

                {isActive && isJoined && item.personalProgress && (
                    <View style={styles.challengeMetrics}>
                        {item.challengeType === "LEAST_SMOKED_WINS" ? (
                            <View style={styles.metricContainer}>
                                <Text style={styles.metricValue}>
                                    {item.personalProgress.totalCigarettesSmoked || 0}
                                </Text>
                                <Text style={styles.metricLabel}>Cigarettes Smoked</Text>
                            </View>
                        ) : (
                            <View style={styles.metricContainer}>
                                <Text style={styles.metricValue}>
                                    {item.personalProgress.totalPoints || 0}
                                </Text>
                                <Text style={styles.metricLabel}>Points</Text>
                            </View>
                        )}

                        <View style={styles.metricContainer}>
                            <Text style={styles.metricValue}>
                                #{item.personalProgress.currentRank || "N/A"}
                            </Text>
                            <Text style={styles.metricLabel}>Current Rank</Text>
                        </View>

                        {item.challengeType === "DAILY_TARGET_POINTS" && item.personalProgress.personalTarget && (
                            <View style={styles.metricContainer}>
                                <Text style={styles.metricValue}>
                                    {item.personalProgress.personalTarget}
                                </Text>
                                <Text style={styles.metricLabel}>Daily Target</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Action buttons */}
                <View style={styles.challengeActions}>
                    {!isJoined && !isCompleted && (
                        <TouchableOpacity
                            style={styles.joinButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleJoinChallenge(item.challengeId, item.challengeType);
                            }}
                        >
                            <Text style={styles.joinButtonText}>Join Challenge</Text>
                        </TouchableOpacity>
                    )}

                    {isJoined && isActive && item.creatorUserId !== user.uid && (
                        <TouchableOpacity
                            style={[styles.joinButton, { backgroundColor: COLOR.red }]}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleLeaveChallenge(item.challengeId);
                            }}
                        >
                            <Text style={styles.joinButtonText}>Leave</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.viewDetailsButton}
                        onPress={() => {
                            navigation.navigate("ChallengeDetail", {
                                challengeId: item.challengeId,
                                challenge: item
                            });
                        }}
                    >
                        <Text style={styles.viewDetailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                </View>
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
                            : "No challenges found."}
            </Text>
            <Text style={styles.noChallengesSubtext}>
                {activeTab === "available"
                    ? "Create a new challenge to get started!"
                    : "Join or create challenges to compete with friends!"}
            </Text>
        </View>
    );

    if (isLoading && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Challenges</Text>
                    <Text style={styles.subHeaderText}>
                        Compete with friends to smoke less
                    </Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLOR.primary} />
                    <Text style={styles.loadingText}>Loading challenges...</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                data={challenges}
                renderItem={renderChallengeCard}
                keyExtractor={(item) => item.challengeId.toString()}
                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLOR.primary]}
                        tintColor={COLOR.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
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