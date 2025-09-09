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

const ChallengeResultsScreen = ({ navigation, route }) => {
    const { challengeId, challenge: initialChallenge } = route.params;
    const { user } = useAuth();
    const [challenge, setChallenge] = useState(initialChallenge || null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [isLoading, setIsLoading] = useState(!initialChallenge);
    const [refreshing, setRefreshing] = useState(false);

    // Load challenge results
    const loadChallengeResults = useCallback(async () => {
        if (!user?.uid) return;

        try {
            setIsLoading(true);

            // Load challenge details, leaderboard, and user progress in parallel
            const [challengeData, leaderboardData, userProgress] = await Promise.all([
                challenge ? Promise.resolve(challenge) : ChallengeService.getChallengeById(challengeId, user.uid),
                ChallengeService.getChallengeLeaderboard(challengeId),
                ChallengeService.getUserProgress(challengeId, user.uid).catch(() => null)
            ]);

            setChallenge(challengeData);
            setLeaderboard(leaderboardData.leaderboard || []);
            setUserStats(userProgress);
        } catch (error) {
            console.error("Error loading challenge results:", error);
            Alert.alert("Error", "Failed to load challenge results. Please try again.");
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    }, [challengeId, user?.uid, navigation, challenge]);

    // Refresh data (pull to refresh)
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadChallengeResults();
        setRefreshing(false);
    }, [loadChallengeResults]);

    // Load data when component mounts
    useEffect(() => {
        if (user?.uid) {
            loadChallengeResults();
        }
    }, [loadChallengeResults, user?.uid]);

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (user?.uid) {
                loadChallengeResults();
            }
        }, [loadChallengeResults, user?.uid])
    );

    // Share results
    const shareResults = async () => {
        if (!challenge || !userStats) return;

        try {
            const userRank = userStats.currentRank;
            const isWinner = userRank === 1;
            const winner = leaderboard.find(p => p.rank === 1);
            const winnerName = winner?.userId === user.uid ? "You" : (winner?.userName || "Someone");

            const message = isWinner
                ? `I won the "${challenge.title}" challenge on Cig++! 🏆`
                : `I just completed the "${challenge.title}" challenge on Cig++. ${winnerName} was the winner!`;

            await Share.share({ message });
        } catch (error) {
            Alert.alert("Error", "Failed to share the results");
        }
    };

    // Start similar challenge
    const startSimilarChallenge = () => {
        if (!challenge) return;

        navigation.navigate("CreateChallenge", {
            prefill: {
                challengeType: challenge.challengeType,
                timeFrameDays: challenge.timeFrameDays,
                description: `Similar to "${challenge.title}"`
            }
        });
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

    // Calculate cigarettes saved (for LEAST_SMOKED_WINS challenges)
    const calculateCigarettesSaved = () => {
        if (!challenge || !userStats || challenge.challengeType !== "LEAST_SMOKED_WINS") {
            return 0;
        }

        // Estimate based on a hypothetical baseline (e.g., user's normal consumption)
        // In a real app, you might store this data or calculate it differently
        const estimatedDailyConsumption = 20; // Placeholder
        const totalDays = challenge.timeFrameDays;
        const estimatedTotal = estimatedDailyConsumption * totalDays;
        const actualSmoked = userStats.totalCigarettesSmoked || 0;

        return Math.max(0, estimatedTotal - actualSmoked);
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
                    <Text style={styles.headerText}>Challenge Results</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLOR.primary} />
                    <Text style={styles.loadingText}>Loading results...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!challenge || !userStats) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.noChallengesContainer}>
                    <Text>Challenge results not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const userRank = userStats.currentRank;
    const isWinner = userRank === 1;
    const winner = leaderboard.find(p => p.rank === 1);
    const winnerName = winner?.userId === user.uid ? "You" : (winner?.userName || "Winner");
    const challengeTypeName = ChallengeService.getChallengeTypeName(challenge.challengeType);
    const timeFrameText = ChallengeService.getTimeFrameText(challenge.timeFrameDays);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={{ position: "absolute", left: 0, paddingVertical: 10 }}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLOR.primary} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Challenge Results</Text>
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
                {/* Congratulations Section */}
                <View style={styles.congratsContainer}>
                    <Ionicons
                        name="trophy"
                        size={80}
                        color={isWinner ? COLOR.orange : COLOR.primary}
                    />
                    <Text style={styles.congratsText}>Challenge Complete!</Text>
                    <Text style={styles.headerText}>{challenge.title}</Text>

                    <View style={{ marginVertical: 20 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: "MontserratRegular",
                                textAlign: "center",
                                color: COLOR.primary,
                            }}
                        >
                            Winner
                        </Text>
                        <Text style={styles.winnerName}>
                            {winnerName}
                            {isWinner && " 🎉"}
                        </Text>
                    </View>
                </View>

                {/* Challenge Details */}
                <View style={styles.formContainer}>
                    <View style={styles.summarySection}>
                        <Text style={styles.inputLabel}>Challenge Details</Text>
                        <Text style={styles.summaryValue}>{challengeTypeName}</Text>
                        <Text style={styles.summaryValue}>{timeFrameText}</Text>
                        <Text style={styles.summaryValue}>
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                        </Text>
                        <Text style={styles.summaryValue}>
                            Participants: {challenge.participantCount}
                        </Text>
                    </View>

                    {/* User Performance */}
                    <View style={styles.summarySection}>
                        <Text style={styles.inputLabel}>Your Performance</Text>

                        <View style={styles.statContainer}>
                            <Text style={styles.statTitle}>Final Rank</Text>
                            <Text style={styles.statValue}>
                                #{userRank} out of {challenge.participantCount}
                            </Text>
                        </View>

                        <View style={styles.statContainer}>
                            <Text style={styles.statTitle}>
                                {challenge.challengeType === "LEAST_SMOKED_WINS"
                                    ? "Total Cigarettes Smoked"
                                    : "Total Points Earned"}
                            </Text>
                            <Text style={styles.statValue}>
                                {challenge.challengeType === "LEAST_SMOKED_WINS"
                                    ? userStats.totalCigarettesSmoked || 0
                                    : userStats.totalPoints || 0}
                            </Text>
                        </View>

                        {challenge.challengeType === "LEAST_SMOKED_WINS" && (
                            <View style={styles.statContainer}>
                                <Text style={styles.statTitle}>Estimated Cigarettes Saved</Text>
                                <Text style={styles.statValue}>{calculateCigarettesSaved()}</Text>
                            </View>
                        )}

                        {challenge.challengeType === "DAILY_TARGET_POINTS" && userStats.personalTarget && (
                            <View style={styles.statContainer}>
                                <Text style={styles.statTitle}>Daily Target</Text>
                                <Text style={styles.statValue}>{userStats.personalTarget}</Text>
                            </View>
                        )}
                    </View>

                    {/* Final Leaderboard */}
                    {leaderboard.length > 0 && (
                        <View style={styles.leaderboard}>
                            <Text style={styles.leaderboardTitle}>Final Leaderboard</Text>

                            {leaderboard.map((participant, index) => (
                                <View
                                    key={participant.userId || index}
                                    style={[
                                        styles.participantCard,
                                        participant.rank === 1 && {
                                            backgroundColor: COLOR.lightBackground,
                                            borderWidth: 2,
                                            borderColor: COLOR.orange,
                                        },
                                    ]}
                                >
                                    <Text style={styles.rankNumber}>#{participant.rank}</Text>
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>
                                            {participant.userId === user.uid ? "You" : (participant.userName || `User ${participant.userId.slice(-4)}`)}
                                            {participant.rank === 1 && " 👑"}
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
                    <CustomButton
                        title="Share Results"
                        style={[styles.createButton, { backgroundColor: COLOR.primary, marginBottom: 10 }]}
                        onPress={shareResults}
                    />

                    <CustomButton
                        title="Start Similar Challenge"
                        style={[styles.createButton, { backgroundColor: COLOR.lightblue, marginBottom: 10 }]}
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