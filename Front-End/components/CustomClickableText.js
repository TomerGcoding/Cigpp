import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomClickableText = ({ title, onPress, style = {} }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
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
    fontWeight: "600",
  },
});

export default CustomClickableText;
