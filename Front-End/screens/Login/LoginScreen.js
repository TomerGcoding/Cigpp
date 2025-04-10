import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./LoginStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../config/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCredentialsFilled, setIsCredentialsFilled] = useState(false);

  useEffect(() => {
    const credentialsFilled = email.trim() !== "" && password.trim() !== "";
    setIsCredentialsFilled(credentialsFilled);
  }, [email, password]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("Tabs");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/invalid-credential") {
          Alert.alert("Error", "Invalid credentials. Please try agian!");
        } else if (errorCode === "auth/invalid-email") {
          Alert.alert("Error", "Please enter a valid email address");
        }
      });
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
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={"#777"}
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
        ></TextInput>
        <TextInput
          value={password}
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor={"#777"}
        ></TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { opacity: !isCredentialsFilled ? 0.5 : 1 }]}
          disabled={!isCredentialsFilled}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textButtonsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.regularText}>Sign Up Now</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.regularText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.regularText}>Other Login Methods</Text>
        <View style={styles.googleIconContainer}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/icons/google.png")}
              style={styles.googleIcon}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default LoginScreen;
