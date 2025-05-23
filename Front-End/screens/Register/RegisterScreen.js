import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./RegisterStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../config/firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomClickableText from "../../components/CustomClickableText";
import { COLOR, FONT } from "../../constants/theme";
import { usePreferences } from "../../contexts/PreferencesContext";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [currentConsumption, setCurrentConsumption] = useState("");
  const [targetConsumption, setTargetConsumption] = useState("");
  const [tobaccoBrand, setTobaccoBrand] = useState("");
  const tobaccoBrands = [
    "Marlboro",
    "Camel",
    "American Spirit",
    "Parliament",
    "Winston",
    "Pall Mall",
    "Balishag",
    "Golden Virginia",
  ];
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [isForm1Filled, setIsForm1Filled] = useState(false);
  const [isForm2Filled, setIsForm2Filled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { saveInitialPreferences } = usePreferences();
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const firstStepFilled =
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      username.trim() !== "" &&
      deviceId.trim() !== "";
    setIsForm1Filled(firstStepFilled);
  }, [email, password, confirmPassword, username, deviceId]);

  useEffect(() => {
    const secondStepFilled =
      currentConsumption.trim() !== "" &&
      targetConsumption.trim() !== "" &&
      tobaccoBrand.trim() !== "" &&
      tobaccoBrands.includes(tobaccoBrand);
    setIsForm2Filled(secondStepFilled);
  }, [currentConsumption, targetConsumption, tobaccoBrand]);

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
    // API call to check if device ID is valid

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
        await saveInitialPreferences(
          username,
          currentConsumption,
          targetConsumption,
          tobaccoBrand
        );
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

  const handleBrandInput = (text) => {
    setTobaccoBrand(text);
    if (text.length > 0) {
      const filtered = tobaccoBrands.filter((brand) =>
        brand.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBrands(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };
  const selectBrand = (brand) => {
    setTobaccoBrand(brand);
    setShowDropdown(false);
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
        <ScrollView style={styles.registerFormContainer}>
          <CustomInput
            label={"Email"}
            placeholder={"Enter your email"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={{
              color: COLOR.primary,
              borderColor: COLOR.primary,
            }}
          />
          <CustomInput
            label={"Password"}
            placeholder={"Enter your password"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            isPasswordInput={true}
            style={{ color: COLOR.primary, borderColor: COLOR.primary }}
          />
          <CustomInput
            label={"Confirm Password"}
            placeholder={"Confirm your password"}
            value={confirmPassword}
            secureTextEntry={true}
            isPasswordInput={true}
            onChangeText={setConfirmPassword}
            style={{ color: COLOR.primary, borderColor: COLOR.primary }}
          />
          <CustomInput
            label={"Username"}
            placeholder={"Choose your username"}
            value={username}
            onChangeText={setUsername}
            style={{ color: COLOR.primary, borderColor: COLOR.primary }}
          />
          <CustomInput
            label={"Device ID"}
            placeholder={"Enter your device ID"}
            value={deviceId}
            onChangeText={setDeviceId}
            style={{ color: COLOR.primary, borderColor: COLOR.primary }}
          />
          <CustomButton
            title={"Next"}
            onPress={nextStep}
            disabled={!isForm1Filled}
            style={{
              backgroundColor: !isForm1Filled ? "transparent" : COLOR.primary,
              borderColor: COLOR.primary,
              borderWidth: 2,
              width: "100%",
              marginTop: 10,
            }}
            textStyle={{ color: !isForm1Filled ? COLOR.primary : "#fff" }}
          />
        </ScrollView>
      ) : (
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={styles.registerFormContainer}>
            <CustomInput
              label={"Current Daily Smoking Habits"}
              placeholder={"# of cigarettes smoked per day"}
              value={currentConsumption}
              onChangeText={setCurrentConsumption}
              keyboardType="numeric"
              style={{ color: COLOR.primary, borderColor: COLOR.primary }}
            />
            <CustomInput
              label={"Target Daily Smoking Habits"}
              placeholder={"# of cigarettes allow yourself daily"}
              value={targetConsumption}
              onChangeText={setTargetConsumption}
              keyboardType="numeric"
              style={{ color: COLOR.primary, borderColor: COLOR.primary }}
            />
            <View style={{ width: "100%" }}>
              <CustomInput
                label={"Tobacco Brand"}
                placeholder={"Start typing to select brand"}
                value={tobaccoBrand}
                onChangeText={handleBrandInput}
                onFocus={() => {
                  if (tobaccoBrand.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                style={{ color: COLOR.primary, borderColor: COLOR.primary }}
              />
              {showDropdown && (
                <View>
                  <FlatList
                    data={filteredBrands}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={dropdownStyles.item}
                        onPress={() => selectBrand(item)}
                      >
                        <Text style={dropdownStyles.itemText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    style={dropdownStyles.list}
                    nestedScrollEnabled={true}
                  />
                </View>
              )}
            </View>

            <CustomButton
              title={"Register"}
              onPress={handleRegister}
              disabled={!isForm2Filled}
              style={{
                backgroundColor: !isForm2Filled ? "transparent" : COLOR.primary,
                borderColor: COLOR.primary,
                borderWidth: 2,
                width: "100%",
                marginTop: 10,
              }}
              textStyle={{ color: !isForm2Filled ? COLOR.primary : "#fff" }}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <CustomClickableText
          textStyle={{ color: COLOR.primary }}
          title={"Login"}
          onPress={() => navigation.navigate("Login")}
        ></CustomClickableText>
      </View>
    </SafeAreaView>
  );
};

const dropdownStyles = {
  list: {
    position: "relative",
    width: "100%",
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 10,
    backgroundColor: COLOR.lightBackground,
    maxHeight: 300,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.subPrimary,
  },
  itemText: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
};

export default RegisterScreen;
