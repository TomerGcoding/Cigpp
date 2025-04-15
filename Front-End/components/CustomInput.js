import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import React, { useState } from "react";
import { FONT } from "../constants/theme";

const CustomInput = ({
  label = "",
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  placeholderTextColor = "#5c3700",
  isPasswordInput = false,
  style = {},
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <View style={styles.field}>
      <Text style={[styles.label, style]}>{label}</Text>
      <View style={isPasswordInput ? [styles.passwordContainer, style] : null}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          style={[
            !isPasswordInput ? styles.input : styles.passwordInput,
            style,
          ]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={
            isPasswordInput ? !isPasswordVisible : secureTextEntry
          }
          keyboardType={keyboardType}
        />
        {isPasswordInput && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.visibilityIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#777"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: FONT.bold,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FONT.bold,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingRight: 12,
    paddingLeft: 4,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    fontFamily: FONT.bold,
  },
  visibilityIcon: {
    marginLeft: 8,
  },
});

export default CustomInput;
