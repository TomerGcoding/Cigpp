import React from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./LoginStyle";

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
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
        <TextInput placeholder="Email" style={styles.input}></TextInput>
        <TextInput placeholder="Password" style={styles.input}></TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Tabs")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textButtonsContainer}>
        <TouchableOpacity>
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
    </View>
  );
};
export default LoginScreen;
