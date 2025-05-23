import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { COLOR, FONT } from "../constants/theme";
import { Ionicons } from "react-native-vector-icons";

const CustomClickableIcon = ({
  onPress,
  name,
  size = 40,
  color = COLOR.primary,
  style = {},
}) => {
  return (
    <TouchableOpacity style={[styles.icon, style]} onPress={onPress}>
      <Ionicons name={name} size={size} color={color}></Ionicons>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    margin: 10,
  },
});

export default CustomClickableIcon;
