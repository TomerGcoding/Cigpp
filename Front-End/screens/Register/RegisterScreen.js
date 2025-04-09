import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./RegisterStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { auth } from "../../config/firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [currentConsumption, setCurrentConsumption] = useState("");
  const [targetConsumption, setTargetConsumption] = useState("");
  const [isForm1Filled, setIsForm1Filled] = useState(false);
  const [isForm2Filled, setIsForm2Filled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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

    // if (parseInt(currentConsumption) <= parseInt(targetConsumption)) {
    //   Alert.alert(
    //     "Error",
    //     "Target Consumption must be lower then current consumption"
    //   );
    //   return false;
    // }
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
        Alert.alert("Success", "Account created successfully");
        navigation.navigate("Tabs");
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => (currentStep === 1 ? navigation.goBack() : prevStep())}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
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
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={"#777"}
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            ></TextInput>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor={"#777"}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.visibilityIcon}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor={"#777"}
              style={styles.input}
              secureTextEntry={!isPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            ></TextInput>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Choose your username"
              placeholderTextColor={"#777"}
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            ></TextInput>
          </View>
          <TouchableOpacity
            style={[styles.button, { opacity: !isForm1Filled ? 0.5 : 1 }]}
            disabled={!isForm1Filled}
            onPress={nextStep}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.registerFormContainer}>
          <View style={styles.field}>
            <Text style={styles.label}>Current Daily Smoking Habits</Text>
            <TextInput
              placeholder="# of cigarettes smoked per day "
              placeholderTextColor={"#777"}
              keyboardType="numeric"
              style={styles.input}
              value={currentConsumption}
              onChangeText={setCurrentConsumption}
            ></TextInput>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Target Daily Smoking Habits </Text>
            <TextInput
              placeholder="# of cigarettes you want to reduce to "
              placeholderTextColor={"#777"}
              keyboardType="numeric"
              style={styles.input}
              value={targetConsumption}
              onChangeText={setTargetConsumption}
            ></TextInput>
          </View>
          <TouchableOpacity
            style={[styles.button, { opacity: !isForm2Filled ? 0.5 : 1 }]}
            disabled={!isForm2Filled}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.footerLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default RegisterScreen;
