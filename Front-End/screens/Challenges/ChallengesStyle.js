import { StyleSheet } from "react-native";
import { COLOR, FONT } from "../../constants/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.background,
        padding: 16,
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
        position: "relative",
        alignItems: "center",
    },
    headerText: {
        fontFamily: FONT.bold,
        fontSize: 26,
        color: COLOR.primary,
        textAlign: "center",
    },
    subHeader: {
        marginBottom: 15,
        alignItems: "center",
    },
    subHeaderText: {
        fontFamily: FONT.regular,
        fontSize: 16,
        color: COLOR.primary,
        textAlign: "center",
        marginTop: 5,
    },

    // Step Indicator Styles
    stepIndicator: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    stepIndicatorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    stepText: {
        fontSize: 14,
        fontFamily: FONT.bold,
    },
    stepLine: {
        width: 40,
        height: 2,
        marginHorizontal: 10,
    },

    // Form Styles
    scrollContainer: {
        flex: 1,
    },
    textInput: {
        backgroundColor: COLOR.white,
        borderRadius: 10,
        padding: 12,
        fontFamily: FONT.regular,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLOR.lightBackground,
    },
    textAreaInput: {
        height: 100,
        textAlignVertical: "top",
    },

    // Loading Styles
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: FONT.regular,
        color: COLOR.primary,
    },

    // Tab Styles
    tabContainer: {
        flexDirection: "row",
        backgroundColor: COLOR.lightBackground,
        borderRadius: 30,
        marginBottom: 20,
        height: 50,
    },
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
    },
    activeTab: {
        backgroundColor: COLOR.primary,
    },
    tabText: {
        fontFamily: FONT.regular,
        fontSize: 14,
        color: COLOR.primary,
    },
    activeTabText: {
        color: COLOR.white,
        fontFamily: FONT.bold,
    },

    // Button Styles
    createButton: {
        backgroundColor: COLOR.primary,
        marginTop: 10,
        width: "90%",
        alignSelf: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginTop: 10,
    },
    actionButton: {
        flex: 0.48,
        marginTop: 0,
        width: "auto",
    },
    joinByIdButton: {
        backgroundColor: COLOR.primary,
        marginTop: 10,
        width: "90%",
        alignSelf: "center",
    },
    navigationButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        paddingHorizontal: 16,
    },
    backButton: {
        backgroundColor: COLOR.lightblue,
        width: "45%",
    },
    nextButton: {
        backgroundColor: COLOR.primary,
        width: "45%",
    },

    // Challenge Card Styles
    challengeCard: {
        backgroundColor: COLOR.lightBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    challengeTitle: {
        fontFamily: FONT.bold,
        fontSize: 18,
        color: COLOR.primary,
        marginBottom: 5,
    },
    challengeType: {
        fontFamily: FONT.italic,
        fontSize: 14,
        color: COLOR.subPrimary,
        marginBottom: 8,
    },
    challengeInfo: {
        fontFamily: FONT.regular,
        fontSize: 14,
        color: COLOR.primary,
        marginBottom: 5,
    },
    challengeMetrics: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    challengeActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 10,
        gap: 10,
    },
    metricContainer: {
        alignItems: "center",
    },
    metricValue: {
        fontFamily: FONT.bold,
        fontSize: 18,
        color: COLOR.primary,
    },
    metricLabel: {
        fontFamily: FONT.regular,
        fontSize: 12,
        color: COLOR.subPrimary,
    },
    statusBadge: {
        position: "absolute",
        top: 15,
        right: 15,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    statusText: {
        fontFamily: FONT.bold,
        fontSize: 12,
        color: COLOR.white,
    },
    joinButton: {
        backgroundColor: COLOR.darkblue,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    joinButtonText: {
        fontFamily: FONT.bold,
        fontSize: 14,
        color: COLOR.white,
    },
    viewDetailsButton: {
        backgroundColor: COLOR.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    viewDetailsButtonText: {
        fontFamily: FONT.bold,
        fontSize: 14,
        color: COLOR.white,
    },

    // Empty State Styles
    noChallengesContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    noChallengesText: {
        fontFamily: FONT.regular,
        fontSize: 18,
        color: COLOR.primary,
        textAlign: "center",
        marginTop: 10,
    },
    noChallengesSubtext: {
        fontFamily: FONT.regular,
        fontSize: 14,
        color: COLOR.subPrimary,
        textAlign: "center",
        marginTop: 5,
    },

    // Form Container Styles
    formContainer: {
        backgroundColor: COLOR.lightBackground,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    inputLabel: {
        fontFamily: FONT.bold,
        fontSize: 16,
        color: COLOR.primary,
        marginBottom: 8,
    },
    summaryTitle: {
        fontFamily: FONT.bold,
        fontSize: 20,
        color: COLOR.primary,
        marginBottom: 20,
        textAlign: "center",
    },
    summarySection: {
        marginBottom: 20,
    },
    summaryValue: {
        fontFamily: FONT.regular,
        fontSize: 18,
        color: COLOR.subPrimary,
        marginBottom: 10,
    },

    // Selection Option Styles
    timeFrameOption: {
        backgroundColor: COLOR.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedTimeFrame: {
        borderColor: COLOR.primary,
    },
    timeFrameText: {
        fontFamily: FONT.regular,
        fontSize: 16,
        color: COLOR.primary,
    },
    ruleTypeContainer: {
        backgroundColor: COLOR.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedRuleType: {
        borderColor: COLOR.primary,
    },
    ruleTypeTitle: {
        fontFamily: FONT.bold,
        fontSize: 18,
        color: COLOR.primary,
        marginBottom: 5,
    },
    ruleTypeDescription: {
        fontFamily: FONT.regular,
        fontSize: 14,
        color: COLOR.subPrimary,
    },

    // Leaderboard Styles
    leaderboard: {
        marginTop: 20,
    },
    leaderboardTitle: {
        fontFamily: FONT.bold,
        fontSize: 20,
        color: COLOR.primary,
        marginBottom: 15,
    },
    participantCard: {
        flexDirection: "row",
        backgroundColor: COLOR.white,
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        alignItems: "center",
    },
    rankNumber: {
        fontFamily: FONT.bold,
        fontSize: 18,
        color: COLOR.primary,
        width: 40,
        textAlign: "center",
    },
    userInfo: {
        flex: 1,
        marginLeft: 10,
    },
    userName: {
        fontFamily: FONT.bold,
        fontSize: 16,
        color: COLOR.primary,
    },
    userStats: {
        fontFamily: FONT.regular,
        fontSize: 14,
        color: COLOR.subPrimary,
    },
    score: {
        fontFamily: FONT.bold,
        fontSize: 18,
        color: COLOR.primary,
        marginRight: 5,
    },

    // Results Screen Styles
    congratsContainer: {
        alignItems: "center",
        paddingVertical: 20,
    },
    congratsText: {
        fontFamily: FONT.bold,
        fontSize: 24,
        color: COLOR.primary,
        textAlign: "center",
    },
    winnerName: {
        fontFamily: FONT.bold,
        fontSize: 28,
        color: COLOR.green,
        marginVertical: 10,
        textAlign: "center",
    },
    statContainer: {
        backgroundColor: COLOR.lightBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        width: "100%",
    },
    statTitle: {
        fontFamily: FONT.bold,
        fontSize: 16,
        color: COLOR.primary,
        marginBottom: 5,
    },
    statValue: {
        fontFamily: FONT.regular,
        fontSize: 18,
        color: COLOR.subPrimary,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: COLOR.background,
        borderRadius: 12,
        padding: 20,
        margin: 20,
        minWidth: "80%",
        maxWidth: "90%",
    },
    modalTitle: {
        fontFamily: FONT.bold,
        fontSize: 20,
        color: COLOR.primary,
        textAlign: "center",
        marginBottom: 10,
    },
    modalSubtitle: {
        fontFamily: FONT.regular,
        fontSize: 16,
        color: COLOR.subPrimary,
        textAlign: "center",
        marginBottom: 15,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: COLOR.lightGray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: FONT.regular,
        color: COLOR.primary,
        marginBottom: 20,
        backgroundColor: COLOR.white,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalButton: {
        flex: 0.48,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    modalCancelButton: {
        backgroundColor: COLOR.lightGray,
    },
    modalSubmitButton: {
        backgroundColor: COLOR.primary,
    },
    modalCancelText: {
        fontFamily: FONT.medium,
        fontSize: 16,
        color: COLOR.subPrimary,
    },
    modalSubmitText: {
        fontFamily: FONT.medium,
        fontSize: 16,
        color: COLOR.white,
    },
});