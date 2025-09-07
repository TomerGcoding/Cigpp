import React, { useState, useEffect, useCallback } from "react";
import {
    SafeAreaView,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    Share,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { styles } from "./ChallengesStyle";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "react-native-vector-icons";
import { COLOR } from "../../constants/theme";
import ChallengeService from "../../services/ChallengeService";

const ChallengeDetailScreen = ({ navigation, route }) => {
    const { challengeId, challenge: initialChallenge } = route.params;
    const { user } = useAuth();
    const [challenge, setChallenge] = useState(initialChallenge || null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(!initialChallenge);
    const [refreshing, setRefreshing] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    // Load challenge details
    const loadChallengeDetails = useCallback(async () => {
        if (!user?.uid) return;

        try {
            setIsLoading(true);

            // Load challenge details and leaderboard in parallel
            const [challengeData, leaderboardData] = await Promise.all([
                ChallengeService.getChallengeById(challengeId, user.uid),
                ChallengeService.getChallengeLeaderboard(challengeId).catch(() => ({ leaderboard: [] }))
            ]);

            setChallenge(challengeData);
            setLeaderboard(leaderboardData.leaderboard || []);
        } catch (error) {
            console.error("Error loading challenge details:", error);
            Alert.alert("Error", "Failed to load challenge details. Please try again.");
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    }, [challengeId, user?.uid, navigation]);

    // Refresh data (pull to refresh)
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadChallengeDetails();
        setRefreshing(false);
    }, [loadChallengeDetails]);

    // Load data when component mounts
    useEffect(() => {
        if (user?.uid && !challenge) {
            loadChallengeDetails();
        }
    }, [loadChallengeDetails, challenge, user?.uid]);

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (user?.uid) {
                loadChallengeDetails();
            }
        }, [loadChallengeDetails, user?.uid])
    );

    // Handle joining challenge
    const handleJoinChallenge = async () => {
        if (!challenge || isJoining) return;

        try {
            setIsJoining(true);

            if (challenge.challengeType === "DAILY_TARGET_POINTS") {
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
                                loadChallengeDetails();
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
                loadChallengeDetails();
            }
        } catch (error) {
            console.error("Error joining challenge:", error);
            Alert.alert("Error", "Failed to join challenge. Please try again.");
        } finally {
            setIsJoining(false);
        }
    };

    // Handle leaving challenge
    const handleLeaveChallenge = async () => {
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
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error leaving challenge:", error);
                            Alert.alert("Error", "Failed to leave challenge. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    // Share challenge
    const shareChallenge = async () => {
        if (!challenge) return;

        try {
            await Share.share({
                message: `Join me in the "${challenge.title}" challenge on Cig++! We're competing to smoke less.`,
            });
        } catch (error) {
            Alert.alert("Error", "Failed to share the challenge");
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (isLoading && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{ position: "absolute", left: 0, paddingVertical: 10 }}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLOR.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Challenge Details</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLOR.primary} />
                    <Text style={styles.loadingText}>Loading challenge details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!challenge) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.noChallengesContainer}>
                    <Text>Challenge not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isCreator = challenge.creatorUserId === user.uid;
    const isJoined = challenge.joined;
    const isActive = challenge.status === "ACTIVE";
    const isCompleted = challenge.status === "COMPLETED";
    const isUpcoming = challenge.status === "UPCOMING";

    const challengeTypeName = ChallengeService.getChallengeTypeName(challenge.challengeType);
    const timeFrameText = ChallengeService.getTimeFrameText(challenge.timeFrameDays);
    const daysRemaining = ChallengeService.getDaysRemaining(challenge.endDate);

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

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLOR.primary]}
                        tintColor={COLOR.primary}
                    />
                }
            >
                <View style={styles.formContainer}>
                    {/* Challenge Information */}
                    <View style={styles.summarySection}>
                        <Text style={styles.inputLabel}>Challenge Type</Text>
                        <Text style={styles.summaryValue}>{challengeTypeName}</Text>
                    </View>

                    <View style={styles.summarySection}>
                        <Text style={styles.inputLabel}>Time Frame</Text>
                        <Text style={styles.summaryValue}>{timeFrameText}</Text>
                        <Text
                            style={[
                                styles.summaryValue,
                                {
                                    fontSize: 14,
                                    color: isActive ? COLOR.green : isCompleted ? COLOR.orange : COLOR.subPrimary,
                                },
                            ]}
                        >
                            {isActive ? daysRemaining : isCompleted ? "Completed" : "Not started"}
                        </Text>
                    </View>

                    <View style={styles.summarySection}>
                        <Text style={styles.inputLabel}>Duration</Text>
                        <Text style={styles.summaryValue}>
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                        </Text>
                    </View>

                    <View style={styles.summarySection}>
                        <Text style={styles.inputLabel}>Participants</Text>
                        <Text style={styles.summaryValue}>{challenge.participantCount} participants</Text>
                    </View>

                    {challenge.description && (
                        <View style={styles.summarySection}>
                            <Text style={styles.inputLabel}>Description</Text>
                            <Text style={styles.summaryValue}>{challenge.description}</Text>
                        </View>
                    )}

                    {/* Personal Progress (only if joined and active) */}
                    {isActive && isJoined && challenge.personalProgress && (
                        <View style={styles.summarySection}>
                            <Text style={styles.inputLabel}>Your Progress</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    marginTop: 10,
                                }}
                            >
                                {challenge.challengeType === "LEAST_SMOKED_WINS" ? (
                                    <View style={styles.metricContainer}>
                                        <Text style={styles.metricValue}>
                                            {challenge.personalProgress.totalCigarettesSmoked || 0}
                                        </Text>
                                        <Text style={styles.metricLabel}>Cigarettes Smoked</Text>
                                    </View>
                                ) : (
                                    <View style={styles.metricContainer}>
                                        <Text style={styles.metricValue}>
                                            {challenge.personalProgress.totalPoints || 0}
                                        </Text>
                                        <Text style={styles.metricLabel}>Points</Text>
                                    </View>
                                )}

                                <View style={styles.metricContainer}>
                                    <Text style={styles.metricValue}>
                                        #{challenge.personalProgress.currentRank || "N/A"}
                                    </Text>
                                    <Text style={styles.metricLabel}>Current Rank</Text>
                                </View>

                                {challenge.challengeType === "DAILY_TARGET_POINTS" && challenge.personalProgress.personalTarget && (
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

                    {/* Leaderboard (only if not upcoming and has participants) */}
                    {!isUpcoming && leaderboard.length > 0 && (
                        <View style={styles.leaderboard}>
                            <Text style={styles.leaderboardTitle}>Leaderboard</Text>

                            {leaderboard.map((participant, index) => (
                                <View key={participant.userId || index} style={styles.participantCard}>
                                    <Text style={styles.rankNumber}>#{participant.rank}</Text>
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>
                                            {participant.userId === user.uid ? "You" : participant.userName || `User ${participant.userId.slice(-4)}`}
                                        </Text>
                                        <Text style={styles.userStats}>
                                            {challenge.challengeType === "LEAST_SMOKED_WINS"
                                                ? `${participant.cigarettesSmoked || 0} cigarettes smoked`
                                                : `${participant.points || 0} points`}
                                        </Text>
                                    </View>
                                    {participant.userId === user.uid && (
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

                {/* Action Buttons */}
                <View style={{ marginVertical: 20, paddingHorizontal: 16 }}>
                    {/* Join Challenge Button */}
                    {!isJoined && !isCompleted && (
                        <CustomButton
                            title={isJoining ? "Joining..." : "Join Challenge"}
                            style={[styles.createButton, { backgroundColor: COLOR.darkblue }]}
                            onPress={handleJoinChallenge}
                            isLoading={isJoining}
                            disabled={isJoining}
                        />
                    )}

                    {/* Leave Challenge Button (only if joined, not creator, and active) */}
                    {isJoined && !isCreator && isActive && (
                        <CustomButton
                            title="Leave Challenge"
                            style={[styles.createButton, { backgroundColor: COLOR.red, marginBottom: 10 }]}
                            onPress={handleLeaveChallenge}
                        />
                    )}

                    {/* Share Challenge Button */}
                    <CustomButton
                        title="Share Challenge"
                        style={[styles.createButton, { backgroundColor: COLOR.lightblue, marginBottom: 10 }]}
                        onPress={shareChallenge}
                    />

                    {/* Edit Challenge Button (only creator and upcoming) */}
                    {isCreator && isUpcoming && (
                        <CustomButton
                            title="Edit Challenge"
                            style={[styles.createButton, { backgroundColor: COLOR.orange, marginBottom: 10 }]}
                            onPress={() => {
                                navigation.navigate("EditChallenge", { challengeId, challenge });
                            }}
                        />
                    )}

                    {/* Delete Challenge Button (only creator and not active) */}
                    {isCreator && !isActive && (
                        <CustomButton
                            title="Delete Challenge"
                            style={[styles.createButton, { backgroundColor: COLOR.red, marginBottom: 10 }]}
                            onPress={() => {
                                Alert.alert(
                                    "Delete Challenge",
                                    "Are you sure you want to delete this challenge? This action cannot be undone.",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        {
                                            text: "Delete",
                                            style: "destructive",
                                            onPress: async () => {
                                                try {
                                                    await ChallengeService.deleteChallenge(challengeId, user.uid);
                                                    Alert.alert("Success", "Challenge deleted successfully.");
                                                    navigation.goBack();
                                                } catch (error) {
                                                    console.error("Error deleting challenge:", error);
                                                    Alert.alert("Error", "Failed to delete challenge. Please try again.");
                                                }
                                            },
                                        },
                                    ]
                                );
                            }}
                        />
                    )}

                    {/* View Results Button (only for completed challenges) */}
                    {isCompleted && (
                        <CustomButton
                            title="View Final Results"
                            style={[styles.createButton, { backgroundColor: COLOR.primary }]}
                            onPress={() => {
                                navigation.navigate("ChallengeResults", { challengeId, challenge });
                            }}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChallengeDetailScreen;