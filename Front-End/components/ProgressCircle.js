import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Svg, Circle, G } from "react-native-svg";
import { FONT, COLOR } from "../constants/theme";

const ProgressCircle = ({ progress, total, limit }) => {
  // Circle settings
  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            stroke="#e6e6e6"
            fill={COLOR.lightBackground}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <Circle
            stroke={progress >= 100 ? "#f39c12" : "#2ecc71"}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.progressText}>{total}</Text>
        <Text style={styles.limitText}>of {limit}</Text>
      </View>
      <Text style={styles.progressSubtext}>
        {limit > 0 && total >= limit
          ? "Daily limit reached"
          : "Cigarettes today"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
  },
  progressText: {
    fontSize: 42,
    fontFamily: FONT.bold,
    color: COLOR.third,
  },
  limitText: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.third,
  },
  progressSubtext: {
    marginTop: 10,
    fontSize: 14,
    color: COLOR.third,
    FONTFamily: FONT.bold,
  },
});

export default ProgressCircle;
