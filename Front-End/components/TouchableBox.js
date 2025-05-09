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
  iconSize = 30,
  iconColor,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.box,
        {
          width: width || "auto",
          height: height || "auto",
          backgroundColor: color || COLOR.lightBackground,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={iconSize}
          color={iconColor || COLOR.sienna}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 35,
    padding: 15,
    marginTop: 10,
    marginHorizontal: 5,
    shadowRadius: 2,
    elevation: 4,
    overflow: "hidden",
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.sienna,
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 14,
    color: COLOR.sienna,
    fontFamily: FONT.regular,
    flexWrap: "wrap",
  },
});

export default TouchableBox;
