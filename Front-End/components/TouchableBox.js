import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { COLOR, FONT } from "../constants/theme";

const TouchableBox = ({
  title,
  subtitle,
  icon,
  onPress,
  width,
  height,
  color,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.box,
        {
          width: width || "90%",
          height: height || "auto",
          backgroundColor: color || COLOR.lightBackground,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={30} color={COLOR.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    overflow: "hidden",
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLOR.subPrimary,
    fontFamily: FONT.regular,
  },
});

export default TouchableBox;
