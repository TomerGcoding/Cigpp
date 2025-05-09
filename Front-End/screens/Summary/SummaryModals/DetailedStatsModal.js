import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { COLOR, FONT } from "../../../constants/theme";
import CustomClickableIcon from "../../../components/CustomClickableIcon";

// Mock data - replace with actual data from your API or database
const dailyData = [
  { hour: "12AM", count: 0 },
  { hour: "6AM", count: 1 },
  { hour: "9AM", count: 1 },
  { hour: "12PM", count: 1 },
  { hour: "3PM", count: 2 },
  { hour: "6PM", count: 1 },
  { hour: "9PM", count: 1 },
];

const weeklyData = [
  { day: "Mon", count: 5 },
  { day: "Tue", count: 7 },
  { day: "Wed", count: 4 },
  { day: "Thu", count: 6 },
  { day: "Fri", count: 8 },
  { day: "Sat", count: 3 },
  { day: "Sun", count: 5 },
];

const monthlyData = [
  { week: "Week 1", count: 32 },
  { week: "Week 2", count: 28 },
  { week: "Week 3", count: 25 },
  { week: "Week 4", count: 22 },
];

const DetailedStatsModal = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [streakDays, setStreakDays] = useState(3); // This would come from your actual data

  // Get data based on selected period
  const getChartData = () => {
    switch (selectedPeriod) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return weeklyData;
    }
  };

  // Get label based on selected period
  const getLabel = () => {
    switch (selectedPeriod) {
      case "daily":
        return "Hour";
      case "weekly":
        return "Day";
      case "monthly":
        return "Week";
      default:
        return "Day";
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const data = getChartData();
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const average = (total / data.length).toFixed(1);
    const max = Math.max(...data.map((item) => item.count));
    const min = Math.min(...data.map((item) => item.count));

    return {
      total,
      average,
      max,
      min,
    };
  };

  const stats = calculateStats();

  // Get formatted date range for display
  const getDateRange = () => {
    const today = new Date();
    const options = { month: "short", day: "numeric" };

    switch (selectedPeriod) {
      case "daily":
        return today.toLocaleDateString(undefined, options);
      case "weekly":
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 6);
        return `${lastWeek.toLocaleDateString(
          undefined,
          options
        )} - ${today.toLocaleDateString(undefined, options)}`;
      case "monthly":
        const lastMonth = new Date(today);
        lastMonth.setDate(today.getDate() - 30);
        return `${lastMonth.toLocaleDateString(
          undefined,
          options
        )} - ${today.toLocaleDateString(undefined, options)}`;
      default:
        return "";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomClickableIcon
          onPress={() => navigation.goBack()}
          color={COLOR.primary}
          size={30}
          name="arrow-back"
        />
        <Text style={styles.title}>Detailed Statistics</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Period selector */}
      <View style={styles.periodSelector}>
        {["daily", "weekly", "monthly"].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodOption,
              selectedPeriod === period && styles.selectedPeriod,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.selectedPeriodText,
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date range */}
      <Text style={styles.dateRange}>{getDateRange()}</Text>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.average}</Text>
          <Text style={styles.statLabel}>
            Average per{" "}
            {selectedPeriod === "daily"
              ? "hour"
              : selectedPeriod === "weekly"
              ? "day"
              : "week"}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streakDays}d</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
      </View>

      {/* Main chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}{" "}
          Consumption
        </Text>

        <View style={styles.chartContent}>
          <View style={styles.yAxisLabels}>
            <Text style={styles.axisLabel}>High</Text>
            <Text style={styles.axisLabel}>Med</Text>
            <Text style={styles.axisLabel}>Low</Text>
          </View>

          <View style={styles.chart}>
            {getChartData().map((item, index) => {
              const data = getChartData();
              const maxValue = Math.max(...data.map((d) => d.count));
              const heightPercentage =
                maxValue > 0 ? (item.count / maxValue) * 100 : 0;

              // Determine bar color based on value relative to average
              const avg = stats.average;
              let barColor = COLOR.primary;
              if (item.count > avg * 1.5) barColor = "#e74c3c"; // High
              else if (item.count < avg * 0.5) barColor = "#2ecc71"; // Low

              // Determine if this is "today" or current period
              const isCurrentPeriod =
                (selectedPeriod === "daily" &&
                  index === dailyData.length - 1) ||
                (selectedPeriod === "weekly" && index === 6);

              return (
                <View key={index} style={styles.barColumn}>
                  <View style={styles.barValueContainer}>
                    <Text style={styles.barValue}>{item.count}</Text>
                  </View>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${heightPercentage}%`,
                          backgroundColor: isCurrentPeriod
                            ? COLOR.primary
                            : barColor + "99",
                          borderColor: isCurrentPeriod
                            ? COLOR.primary
                            : barColor,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.barLabel,
                      isCurrentPeriod && styles.currentBarLabel,
                    ]}
                  >
                    {selectedPeriod === "daily"
                      ? item.hour
                      : selectedPeriod === "weekly"
                      ? item.day
                      : item.week}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Additional insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Insights</Text>

        <View style={styles.insightRow}>
          <View style={styles.insightIconContainer}>
            <Ionicons name="trending-down" size={18} color="#2ecc71" />
          </View>
          <Text style={styles.insightText}>
            {selectedPeriod === "weekly"
              ? "Your Wednesday consumption was 43% lower than average."
              : selectedPeriod === "daily"
              ? "Morning hours (6-9AM) show the lowest consumption."
              : "Week 3 shows a 10% reduction from Week 2."}
          </Text>
        </View>

        <View style={styles.insightRow}>
          <View style={styles.insightIconContainer}>
            <Ionicons name="trending-up" size={18} color="#e74c3c" />
          </View>
          <Text style={styles.insightText}>
            {selectedPeriod === "weekly"
              ? "Friday was your highest consumption day this week."
              : selectedPeriod === "daily"
              ? "Afternoon (3PM) shows peak consumption for today."
              : "Week 1 had the highest consumption this month."}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  periodOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  selectedPeriod: {
    backgroundColor: COLOR.primary,
  },
  periodText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: COLOR.primary,
  },
  selectedPeriodText: {
    color: "#FFFFFF",
  },
  dateRange: {
    textAlign: "center",
    fontFamily: FONT.medium,
    fontSize: 14,
    color: COLOR.subPrimary,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statCard: {
    width: "30%",
    alignItems: "center",
    backgroundColor: COLOR.lightBackground,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
    textAlign: "center",
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLOR.lightBackground,
    borderRadius: 16,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 15,
  },
  chartContent: {
    flexDirection: "row",
    height: 200,
    marginTop: 10,
  },
  yAxisLabels: {
    width: 30,
    height: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  axisLabel: {
    fontSize: 10,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
  },
  chart: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "100%",
  },
  barColumn: {
    alignItems: "center",
    width: "12%",
    height: "100%",
    justifyContent: "flex-end",
  },
  barValueContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
  },
  barValue: {
    fontSize: 12,
    fontFamily: FONT.bold,
    color: COLOR.subPrimary,
  },
  barWrapper: {
    width: "100%",
    height: "80%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: "70%",
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
    marginTop: 8,
  },
  currentBarLabel: {
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  insightsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  insightsTitle: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 15,
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: COLOR.lightBackground,
    borderRadius: 12,
    padding: 12,
  },
  insightIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLOR.primary,
    lineHeight: 20,
  },
});

export default DetailedStatsModal;
