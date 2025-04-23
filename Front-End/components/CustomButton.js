import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { COLOR, FONT } from "../constants/theme";

const CustomButton = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style = {},
  textStyle = {},
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        { opacity: disabled || isLoading ? 0.5 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffff" size="small" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLOR.primary,
    padding: 12,
    borderRadius: 30,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FONT.bold,
  },
});

export default CustomButton;
