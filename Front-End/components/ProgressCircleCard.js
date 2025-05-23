import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { COLOR, FONT } from "../constants/theme";
import { Svg, Circle, G } from "react-native-svg";

const ProgressCircleCard = ({ total, limit, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (total / limit) * circumference;

  const handlePress = (toValue) => {
    Animated.spring(scaleAnim, {
      toValue,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderCircle = (stroke, fill, dashOffset = 0) => (
    <Circle
      stroke={stroke}
      fill={fill}
      cx={size / 2}
      cy={size / 2}
      r={radius}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeDashoffset={dashOffset}
      strokeLinecap="round"
    />
  );

  const getProgressColor = (total, limit) => {
    if (limit > 0 && total >= limit) {
      return COLOR.red;
    } else if (total > limit * 0.75) {
      return COLOR.orange;
    } else {
      return COLOR.green;
    }
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={() => handlePress(0.95)}
        onPressOut={() => handlePress(1)}
      >
        <Text style={styles.label}>Daily Cigarettes</Text>
        <View style={styles.circleContainer}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {/* Background Circle */}
              {renderCircle("#e6e6e6", COLOR.lightBackground)}
              {/* Progress Circle */}
              {renderCircle(
                getProgressColor(total, limit),
                "none",
                strokeDashoffset
              )}
            </G>
          </Svg>
          <View style={styles.circleTextContainer}>
            <Text style={styles.progressText}>{total}</Text>
            <Text style={styles.limitText}>of {limit}</Text>
          </View>
        </View>
        <Text style={styles.text}>
          {limit > 0 && total >= limit
            ? "Daily limit reached"
            : "Cigarettes today"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLOR.lightBackground,
    borderRadius: 35,
    padding: 20,
    width: "100%",
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 10,
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleTextContainer: {
    position: "absolute",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: COLOR.primary,
    fontFamily: FONT.regular,
    marginTop: 10,
    textAlign: "center",
  },
  progressText: {
    fontSize: 42,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    textAlign: "center",
  },
  limitText: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    textAlign: "center",
  },
});

export default ProgressCircleCard;
