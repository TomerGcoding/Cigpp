import React, { useEffect, useState } from "react";
import { View, Text, Alert, ImageBackground } from "react-native";
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
import { FONT } from "../../constants/theme";

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
        } else if (errorCode === "auth/network-request-failed") {
          Alert.alert("Error", "Please check your internet connection");
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
    <ImageBackground
      source={require("../../assets/backgrounds/LoginBackground2.0.png")}
      resizeMode="cover"
      style={{ flex: 1, opacity: 0.8 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={{ alignItems: "center", top: -80 }}>
          <Text
            style={{ fontFamily: FONT.italic, color: "#5c3721", fontSize: 54 }}
          >
            Cig++
          </Text>
        </View>

        <View style={styles.loginFormContainer}>
          <Text style={[styles.loginHeader, { fontFamily: FONT.regular }]}>
            Login
          </Text>
          <CustomInput
            placeholder={"Email"}
            keyboardType={"email-address"}
            value={email}
            onChangeText={setEmail}
            style={{
              borderColor: "#5c3721",
              color: "#5c3721",
            }}
          ></CustomInput>
          <CustomInput
            placeholder={"Password"}
            isPasswordInput={true}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            style={{
              borderColor: "#5c3721",
              color: "#5c3721",
            }}
          ></CustomInput>
          <View style={styles.buttonContainer}>
            <CustomButton
              title={"Login"}
              onPress={handleLogin}
              isLoading={isLoading}
              disabled={!isCredentialsFilled || isLoading}
              style={{
                backgroundColor: !isCredentialsFilled
                  ? "transparent"
                  : "#5c3721",
                borderColor: "#5c3721",
                borderWidth: 2,
              }}
              textStyle={{ color: !isCredentialsFilled ? "#5c3721" : "#fff" }}
            ></CustomButton>
          </View>

          <View style={styles.textButtonsContainer}>
            <CustomClickableText
              title={"Sign Up Now"}
              onPress={() => navigation.navigate("Register")}
              textStyle={{ color: "#5c3721" }}
            ></CustomClickableText>
            <CustomClickableText
              title={"Forgot Password?"}
              onPress={handleForgotPassword}
              textStyle={{ color: "#5c3721" }}
            ></CustomClickableText>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
export default LoginScreen;
