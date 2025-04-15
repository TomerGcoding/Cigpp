import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./LoginStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../config/firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomClickableText from "../../components/CustomClickableText";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCredentialsFilled, setIsCredentialsFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  useEffect(() => {
    const credentialsFilled = email.trim() !== "" && password.trim() !== "";
    setIsCredentialsFilled(credentialsFilled);
  }, [email, password]);

  const handleLogin = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/invalid-credential") {
          Alert.alert("Error", "Invalid credentials. Please try agian!");
        } else if (errorCode === "auth/invalid-email") {
          Alert.alert("Error", "Please enter a valid email address");
        } else {
          Alert.alert("Error", errorMessage);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(
        "Enter Email",
        "Please enter your email to reset your password."
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset",
        "If an account with that email exists, a password reset email has been sent."
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View>
        <Image
          source={require("../../assets/cig_splash(2).png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.loginFormContainer}>
        <Text style={styles.loginHeader}>Login</Text>
        <CustomInput
          placeholder={"Email"}
          keyboardType={"email-address"}
          value={email}
          onChangeText={setEmail}
        ></CustomInput>
        <CustomInput
          placeholder={"Password"}
          isPasswordInput={true}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        ></CustomInput>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title={"Login"}
          onPress={handleLogin}
          isLoading={isLoading}
          disabled={!isCredentialsFilled || isLoading}
        ></CustomButton>
      </View>

      <View style={styles.textButtonsContainer}>
        <CustomClickableText
          title={"Sign Up Now"}
          onPress={() => navigation.navigate("Register")}
        ></CustomClickableText>
        <CustomClickableText
          title={"Forgot Password?"}
          onPress={handleForgotPassword}
        ></CustomClickableText>
      </View>
    </SafeAreaView>
  );
};
export default LoginScreen;
