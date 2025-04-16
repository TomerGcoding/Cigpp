import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "react-native-vector-icons";

const TouchableBox = ({ title, subtitle, icon, onPress, width, height }) => {
  return (
    <TouchableOpacity
      style={[styles.box, { width: width || "90%", height: height || "auto" }]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={30} color="#50C878" />
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
    backgroundColor: "#F7FBF4",
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
    fontWeight: "bold",
    color: "#535e4b",
  },
  subtitle: {
    fontSize: 14,
    color: "#474739",
  },
});

export default TouchableBox;
