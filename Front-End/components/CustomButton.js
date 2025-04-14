import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const CustomButton = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style = {},
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
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#50C878",
    padding: 12,
    borderRadius: 30,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
