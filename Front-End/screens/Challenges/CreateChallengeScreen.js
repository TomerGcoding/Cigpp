import React, {useState} from "react";
import {
    SafeAreaView,
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import {useAuth} from "../../contexts/AuthContext";
import {styles} from "./ChallengesStyle";
import CustomButton from "../../components/CustomButton";
import {COLOR, FONT} from "../../constants/theme";
import {Ionicons} from "react-native-vector-icons";
import ChallengeService from "../../services/ChallengeService";
import {usePreferences} from "../../contexts/PreferencesContext";

// Challenge type options matching backend enum
const challengeTypes = [
    {
        id: "LEAST_SMOKED_WINS",
        title: "Least Smoked Wins",
        description: "The participant who smokes the least number of cigarettes during the entire challenge wins.",
        rules: "Total cigarettes are counted throughout the challenge period. Lowest count wins.",
    },
    {
        id: "DAILY_TARGET_POINTS",
        title: "Daily Target Points",
        description: "Gain 1 point for every cigarette you smoke less than your daily target. Lose 2 points for each cigarette over target.",
        rules: "Points are calculated daily based on your personal target. Most points at the end wins.",
    },
];

// Time frame options
const timeFrameOptions = [
    {id: 3, label: "3 Days", value: 3},
    {id: 7, label: "1 Week", value: 7},
    {id: 14, label: "2 Weeks", value: 14},
    {id: 30, label: "1 Month", value: 30},
];

const CreateChallengeScreen = ({navigation}) => {
    const {user} = useAuth();
    const {preferences} = usePreferences();

    // Form state
    const [challengeName, setChallengeName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTimeFrame, setSelectedTimeFrame] = useState(null);
    const [selectedChallengeType, setSelectedChallengeType] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isCreating, setIsCreating] = useState(false);

    // Validation functions
    const isStep1Valid = () => challengeName.trim().length > 0;
    const isStep2Valid = () => selectedTimeFrame !== null;
    const isStep3Valid = () => selectedChallengeType !== null;

    // Navigation functions
    const goToNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Create challenge function
    const createChallenge = async () => {
        if (!user?.uid) {
            Alert.alert("Error", "You must be logged in to create a challenge.");
            return;
        }

        const selectedTimeFrameObj = timeFrameOptions.find(option => option.id === selectedTimeFrame);
        const selectedChallengeTypeObj = challengeTypes.find(type => type.id === selectedChallengeType);

        if (!selectedTimeFrameObj || !selectedChallengeTypeObj) {
            Alert.alert("Error", "Please complete all required fields.");
            return;
        }

        try {
            setIsCreating(true);

            // Calculate start date (tomorrow at midnight)
            const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

            const challengeData = {
                title: challengeName.trim(),
                description: description.trim() || null,
                challengeType: selectedChallengeType,
                timeFrameDays: selectedTimeFrameObj.value,
                startDate: startDate.toISOString(),
                personalTarget: selectedChallengeType === "DAILY_TARGET_POINTS" ? preferences.targetConsumption : null
            };

            await ChallengeService.createChallenge(challengeData, user.uid);

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
        } catch (error) {
            console.error("Error creating challenge:", error);
            Alert.alert("Error", "Failed to create challenge. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    // Render step indicator
    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            {[1, 2, 3, 4].map((step) => (
                <View key={step} style={styles.stepIndicatorContainer}>
                    <View
                        style={[
                            styles.stepCircle,
                            {
                                backgroundColor: step <= currentStep ? COLOR.primary : COLOR.lightBackground,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.stepText,
                                {
                                    color: step <= currentStep ? COLOR.white : COLOR.subPrimary,
                                },
                            ]}
                        >
                            {step}
                        </Text>
                    </View>
                    {step < 4 && (
                        <View
                            style={[
                                styles.stepLine,
                                {
                                    backgroundColor: step < currentStep ? COLOR.primary : COLOR.lightBackground,
                                },
                            ]}
                        />
                    )}
                </View>
            ))}
        </View>
    );

    // Render step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Challenge Name *</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter a name for your challenge"
                            value={challengeName}
                            onChangeText={setChallengeName}
                            maxLength={50}
                        />

                        <Text style={styles.inputLabel}>Description (optional)</Text>
                        <TextInput
                            style={[styles.textInput, styles.textAreaInput]}
                            placeholder="Describe your challenge"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            maxLength={200}
                            textAlignVertical="top"
                        />
                    </View>
                );

            case 2:
                return (
                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Select Challenge Duration *</Text>
                        {timeFrameOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.timeFrameOption,
                                    selectedTimeFrame === option.id && styles.selectedTimeFrame,
                                ]}
                                onPress={() => setSelectedTimeFrame(option.id)}
                            >
                                <Text style={styles.timeFrameText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            case 3:
                return (
                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Select Challenge Type *</Text>
                        {challengeTypes.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.ruleTypeContainer,
                                    selectedChallengeType === type.id && styles.selectedRuleType,
                                ]}
                                onPress={() => setSelectedChallengeType(type.id)}
                            >
                                <Text style={styles.ruleTypeTitle}>{type.title}</Text>
                                <Text style={styles.ruleTypeDescription}>{type.description}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            case 4:
                const selectedTimeFrameObj = timeFrameOptions.find(option => option.id === selectedTimeFrame);
                const selectedChallengeTypeObj = challengeTypes.find(type => type.id === selectedChallengeType);

                return (
                    <View style={styles.formContainer}>
                        <Text style={styles.summaryTitle}>Review Your Challenge</Text>

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
                            <Text style={styles.summaryValue}>{selectedTimeFrameObj?.label}</Text>
                        </View>

                        <View style={styles.summarySection}>
                            <Text style={styles.inputLabel}>Challenge Type</Text>
                            <Text style={styles.summaryValue}>{selectedChallengeTypeObj?.title}</Text>
                            <Text style={[styles.summaryValue, {fontSize: 14, fontStyle: "italic"}]}>
                                {selectedChallengeTypeObj?.rules}
                            </Text>
                        </View>

                        <View style={styles.summarySection}>
                            <Text style={styles.inputLabel}>Start Date</Text>
                            <Text style={styles.summaryValue}>
                                Tomorrow ({new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()})
                            </Text>
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    // Get step validation
    const getStepValidation = () => {
        switch (currentStep) {
            case 1:
                return isStep1Valid();
            case 2:
                return isStep2Valid();
            case 3:
                return isStep3Valid();
            case 4:
                return true;
            default:
                return false;
        }
    };

    // Get step title
    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return "Basic Information";
            case 2:
                return "Time Frame";
            case 3:
                return "Challenge Type";
            case 4:
                return "Review & Create";
            default:
                return "";
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={{position: "absolute", left: 0, paddingVertical: 10}}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLOR.primary}/>
                </TouchableOpacity>
                <Text style={styles.headerText}>Create Challenge</Text>
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>Step {currentStep}: {getStepTitle()}</Text>
            </View>

            {renderStepIndicator()}

            <ScrollView style={styles.scrollContainer}>
                {renderStepContent()}
            </ScrollView>

            <View style={styles.navigationButtons}>
                {currentStep > 1 && (
                    <CustomButton
                        title="Back"
                        style={styles.backButton}
                        onPress={goToPreviousStep}
                        disabled={isCreating}
                    />
                )}

                {currentStep < 4 ? (
                    <CustomButton
                        title="Next"
                        style={styles.nextButton}
                        disabled={!getStepValidation()}
                        onPress={goToNextStep}
                    />
                ) : (
                    <CustomButton
                        title={isCreating ? "Creating..." : "Create Challenge"}
                        style={styles.nextButton}
                        onPress={createChallenge}
                        isLoading={isCreating}
                        disabled={isCreating}
                    />
                )}

                {currentStep === 1 && (
                    <CustomButton
                        title="Cancel"
                        style={[styles.backButton, {backgroundColor: COLOR.orange}]}
                        onPress={() => navigation.goBack()}
                        disabled={isCreating}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default CreateChallengeScreen;