import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./RegisterStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../config/firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomClickableText from "../../components/CustomClickableText";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [currentConsumption, setCurrentConsumption] = useState("");
  const [targetConsumption, setTargetConsumption] = useState("");
  const [isForm1Filled, setIsForm1Filled] = useState(false);
  const [isForm2Filled, setIsForm2Filled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const firstStepFilled =
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      username.trim() !== "";
    setIsForm1Filled(firstStepFilled);
  }, [email, password, confirmPassword, username]);

  useEffect(() => {
    const secondStepFilled =
      currentConsumption.trim() !== "" && targetConsumption.trim() !== "";
    setIsForm2Filled(secondStepFilled);
  }, [currentConsumption, targetConsumption]);

  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Error",
        "Password confirmation different then password entered"
      );
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const dailyCigs = parseInt(currentConsumption);
    const targetCigs = parseInt(targetConsumption);

    if (isNaN(dailyCigs) || dailyCigs <= 0) {
      Alert.alert("Error", "Please enter a valid number for daily average");
      return false;
    }

    if (isNaN(targetCigs) || targetCigs < 0) {
      Alert.alert("Error", "Please enter a valid number for daily average");
      return false;
    }

    if (targetCigs > dailyCigs) {
      Alert.alert(
        "Error",
        "Daily target should be less than or equal to your current amount"
      );
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };
  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleRegister = async () => {
    try {
      if (validateStep2()) {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredentials.user;
        await updateProfile(user, { displayName: `${username}` });
        Alert.alert("Success", "Account created successfully");
      } else {
        return;
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "The email address is already in use.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "The email address is not valid.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Error", "The password is too weak.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          {currentStep === 1
            ? "Step 1: Your Login Information"
            : "Step 2: Your Smoking Habits"}
        </Text>
      </View>
      {currentStep === 1 ? (
        <View style={styles.registerFormContainer}>
          <CustomInput
            label={"Email"}
            placeholder={"Enter your email"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomInput
            label={"Password"}
            placeholder={"Enter your password"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            isPasswordInput={true}
          />
          <CustomInput
            label={"Confirm Password"}
            placeholder={"Confirm your password"}
            value={confirmPassword}
            secureTextEntry={true}
            isPasswordInput={true}
            onChangeText={setConfirmPassword}
          />
          <CustomInput
            label={"Username"}
            placeholder={"Choose your username"}
            value={username}
            onChangeText={setUsername}
          />
          <CustomButton
            title={"Next"}
            onPress={nextStep}
            disabled={!isForm1Filled}
            style={{ width: "100%" }}
          />
        </View>
      ) : (
        <View style={styles.registerFormContainer}>
          <CustomInput
            label={"Current Daily Smoking Habits"}
            placeholder={"# of cigarettes smoked per day"}
            value={currentConsumption}
            onChangeText={setCurrentConsumption}
            keyboardType="numeric"
          />
          <CustomInput
            label={"Target Daily Smoking Habits"}
            placeholder={"# of cigarettes you want to reduce to"}
            value={targetConsumption}
            onChangeText={setTargetConsumption}
            keyboardType="numeric"
          />
          <CustomButton
            title={"Register"}
            onPress={handleRegister}
            disabled={!isForm2Filled}
            style={{ width: "100%" }}
          />
        </View>
      )}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <CustomClickableText
          title={"Login"}
          onPress={() => navigation.navigate("Login")}
        ></CustomClickableText>
      </View>
    </SafeAreaView>
  );
};
export default RegisterScreen;
