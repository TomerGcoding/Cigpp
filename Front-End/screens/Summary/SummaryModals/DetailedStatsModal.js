import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { COLOR, FONT } from "../../../constants/theme";
import CustomClickableIcon from "../../../components/CustomClickableIcon";
import StatisticsService from "../../../services/StatisticsService";
import { useAuth } from "../../../contexts/AuthContext";

const DetailedStatsModal = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [chartData, setChartData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    average: 0,
    max: 0,
    min: 0,
    currentStreak: 0,
    dateRange: "",
    bestInsight: "",
    worstInsight: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data based on selected period
  const fetchData = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);

      let data;
      switch (selectedPeriod) {
        case "daily":
          data = await StatisticsService.getDailyStats(user.uid);
          break;
        case "weekly":
          data = await StatisticsService.getWeeklyStats(user.uid);
          break;
        case "monthly":
          data = await StatisticsService.getMonthlyStats(user.uid);
          break;
        default:
          data = [];
      }

      const summary = await StatisticsService.getStatsSummary(
        user.uid,
        selectedPeriod
      );

      setChartData(data);
      setSummaryStats(summary);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, selectedPeriod]);

  // Refresh data (pull to refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  // Load data when component mounts or period changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        fetchData();
      }
    }, [user?.uid, fetchData])
  );

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

  // Handle period selection
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  if (isLoading && !refreshing) {
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR.primary} />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={COLOR.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLOR.primary]}
            tintColor={COLOR.primary}
          />
        }
      >
        {/* Period selector */}
        <View style={styles.periodSelector}>
          {["daily", "weekly", "monthly"].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodOption,
                selectedPeriod === period && styles.selectedPeriod,
              ]}
              onPress={() => handlePeriodChange(period)}
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
        <Text style={styles.dateRange}>{summaryStats.dateRange}</Text>

        {/* Summary stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summaryStats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {summaryStats.average.toFixed(1)}
            </Text>
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
            <Text style={styles.statValue}>{summaryStats.currentStreak}d</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
        </View>

        {/* Main chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}{" "}
            Consumption
          </Text>

          {chartData.length > 0 ? (
            <View style={styles.chartContent}>
              <View style={styles.yAxisLabels}>
                <Text style={styles.axisLabel}>High</Text>
                <Text style={styles.axisLabel}>Med</Text>
                <Text style={styles.axisLabel}>Low</Text>
              </View>

              <View style={styles.chart}>
                {chartData.map((item, index) => {
                  const maxValue = Math.max(...chartData.map((d) => d.count));
                  const heightPercentage =
                    maxValue > 0 ? (item.count / maxValue) * 100 : 0;

                  // Determine bar color based on value relative to average
                  const avg = summaryStats.average;
                  let barColor = COLOR.primary;
                  if (item.count > avg * 1.5) barColor = "#e74c3c"; // High
                  else if (item.count < avg * 0.5) barColor = "#2ecc71"; // Low

                  // Determine if this is current period
                  const isCurrentPeriod =
                    (selectedPeriod === "daily" &&
                      index === chartData.length - 1) ||
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
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="bar-chart-outline" size={60} color="#d0d0d0" />
              <Text style={styles.noDataText}>No data available</Text>
              <Text style={styles.noDataSubtext}>
                Start tracking cigarettes to see your statistics
              </Text>
            </View>
          )}
        </View>

        {/* Additional insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Insights</Text>

          {summaryStats.bestInsight && (
            <View style={styles.insightRow}>
              <View style={styles.insightIconContainer}>
                <Ionicons name="trending-down" size={18} color="#2ecc71" />
              </View>
              <Text style={styles.insightText}>{summaryStats.bestInsight}</Text>
            </View>
          )}

          {summaryStats.worstInsight && (
            <View style={styles.insightRow}>
              <View style={styles.insightIconContainer}>
                <Ionicons name="trending-up" size={18} color="#e74c3c" />
              </View>
              <Text style={styles.insightText}>
                {summaryStats.worstInsight}
              </Text>
            </View>
          )}

          {!summaryStats.bestInsight && !summaryStats.worstInsight && (
            <View style={styles.insightRow}>
              <View style={styles.insightIconContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={COLOR.primary}
                />
              </View>
              <Text style={styles.insightText}>
                Keep tracking your cigarettes to unlock personalized insights!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  refreshButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: FONT.regular,
    color: COLOR.primary,
  },
  scrollView: {
    flex: 1,
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
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginTop: 15,
  },
  noDataSubtext: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
    textAlign: "center",
    marginTop: 8,
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
