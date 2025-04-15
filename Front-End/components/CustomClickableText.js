import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FONT } from "../constants/theme";

const CustomClickableText = ({
  title,
  onPress,
  style = {},
  textStyle = {},
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#50C878",
    fontSize: 14,
    fontFamily: FONT.bold,
  },
});

export default CustomClickableText;
