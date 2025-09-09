import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { COLOR, FONT } from "../../../constants/theme";
import CustomClickableIcon from "../../../components/CustomClickableIcon";
import StatisticsService from "../../../services/StatisticsService";
import { useAuth } from "../../../contexts/AuthContext";
import { usePreferences } from "../../../contexts/PreferencesContext";

const { width: screenWidth } = Dimensions.get('window');

const DetailedStatsModal = ({ navigation }) => {
  const { user } = useAuth();
  const { preferences } = usePreferences();
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [chartData, setChartData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    average: 0,
    max: 0,
    min: 0,
    dateRange: "",
    bestInsight: "",
    worstInsight: "",
  });
  const [trendData, setTrendData] = useState({
    percentageChange: 0,
    daysBelow: 0,
    peakPeriod: "",
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
        case "weekly":
          data = await StatisticsService.getWeeklyStats(user.uid);
          break;
        case "monthly":
          data = await StatisticsService.getMonthlyStats(user.uid);
          break;
        case "yearly":
          data = await StatisticsService.getYearlyStats(user.uid);
          break;
        default:
          data = [];
      }

      const summary = await StatisticsService.getStatsSummary(
          user.uid,
          selectedPeriod
      );

      // Get trend data
      const trends = await StatisticsService.getTrendData(
          user.uid,
          selectedPeriod,
          preferences.targetConsumption
      );

      setChartData(data);
      setSummaryStats(summary);
      setTrendData(trends);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, selectedPeriod, preferences.targetConsumption]);

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

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Helper function for stat cards
  const getStatCard = (title, value, subtitle, icon, color) => (
      <View style={[styles.statCard, { borderLeftColor: color }]}>
        <View style={styles.statHeader}>
          <Ionicons name={icon} size={20} color={color} />
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </View>
  );

  // Render enhanced chart
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
          <View style={styles.noDataContainer}>
            <Ionicons name="bar-chart-outline" size={60} color="#d0d0d0" />
            <Text style={styles.noDataText}>No data available</Text>
            <Text style={styles.noDataSubtext}>
              Start tracking cigarettes to see your statistics
            </Text>
          </View>
      );
    }

    const maxValue = Math.max(...chartData.map(d => d.count));

    return (
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Overview
            </Text>
          </View>

          <View style={styles.chartContent}>
            {/* Y-axis labels */}
            <View style={styles.yAxisContainer}>
              <Text style={styles.yAxisLabel}>{maxValue}</Text>
              <Text style={styles.yAxisLabel}>{Math.round(maxValue * 0.5)}</Text>
              <Text style={styles.yAxisLabel}>0</Text>
            </View>

            {/* Chart bars */}
            <View style={styles.chartBars}>
              {chartData.map((item, index) => {
                const heightPercentage = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
                const barColor = COLOR.primary;

                return (
                    <View key={index} style={styles.barColumn}>
                      {/* Value label */}
                      <View style={styles.barValueContainer}>
                        {item.count > 0 && (
                            <View style={[styles.valueLabel, { backgroundColor: barColor }]}>
                              <Text style={styles.valueLabelText}>{item.count}</Text>
                            </View>
                        )}
                      </View>

                      {/* Bar */}
                      <View style={styles.barContainer}>
                        <View
                            style={[
                              styles.bar,
                              {
                                height: `${heightPercentage}%`,
                                backgroundColor: barColor + '80',
                                borderColor: barColor,
                              },
                            ]}
                        />
                      </View>

                      {/* X-axis label */}
                      <Text style={styles.barLabel} numberOfLines={1} ellipsizeMode="tail">
                        {selectedPeriod === "weekly" ? item.day :
                            selectedPeriod === "monthly" ? item.week : item.month}
                      </Text>
                    </View>
                );
              })}
            </View>
          </View>
        </View>
    );
  };

  // Render trend analysis section with real data
  const renderTrendAnalysis = () => (
      <View style={styles.trendContainer}>
        <Text style={styles.sectionTitle}>Trend Analysis</Text>

        <View style={styles.trendCards}>
          <View style={[styles.trendCard, {
            backgroundColor: trendData.percentageChange >= 0 ? COLOR.red + '20' : COLOR.green + '20'
          }]}>
            <Ionicons
                name={trendData.percentageChange >= 0 ? "trending-up" : "trending-down"}
                size={24}
                color={trendData.percentageChange >= 0 ? COLOR.red : COLOR.green}
            />
            <Text style={styles.trendValue}>
              {trendData.percentageChange >= 0 ? '+' : ''}{trendData.percentageChange}%
            </Text>
            <Text style={styles.trendLabel}>
              vs Last {selectedPeriod === 'weekly' ? 'Week' : selectedPeriod === 'monthly' ? 'Month' : 'Year'}
            </Text>
          </View>

          <View style={[styles.trendCard, { backgroundColor: COLOR.primary + '20' }]}>
            <Ionicons name="calendar-outline" size={24} color={COLOR.primary} />
            <Text style={styles.trendValue}>{trendData.daysBelow}</Text>
            <Text style={styles.trendLabel}>Days Below Target</Text>
          </View>

          <View style={[styles.trendCard, { backgroundColor: COLOR.orange + '20' }]}>
            <Ionicons name="time-outline" size={24} color={COLOR.orange} />
            <Text style={styles.trendValue}>{trendData.peakPeriod}</Text>
            <Text style={styles.trendLabel}>Peak Time</Text>
          </View>
        </View>
      </View>
  );

  // Render insights section
  const renderInsights = () => (
      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Smart Insights</Text>

        {summaryStats.bestInsight && (
            <View style={[styles.insightCard, { backgroundColor: COLOR.green + '15' }]}>
              <View style={[styles.insightIcon, { backgroundColor: COLOR.green }]}>
                <Ionicons name="trending-down" size={18} color={COLOR.white} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Good Progress</Text>
                <Text style={styles.insightText}>{summaryStats.bestInsight}</Text>
              </View>
            </View>
        )}

        {summaryStats.worstInsight && (
            <View style={[styles.insightCard, { backgroundColor: COLOR.orange + '15' }]}>
              <View style={[styles.insightIcon, { backgroundColor: COLOR.orange }]}>
                <Ionicons name="warning" size={18} color={COLOR.white} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Area for Improvement</Text>
                <Text style={styles.insightText}>{summaryStats.worstInsight}</Text>
              </View>
            </View>
        )}

        <View style={[styles.insightCard, { backgroundColor: COLOR.primary + '15' }]}>
          <View style={[styles.insightIcon, { backgroundColor: COLOR.primary }]}>
            <Ionicons name="bulb" size={18} color={COLOR.white} />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Tip</Text>
            <Text style={styles.insightText}>
              Consider setting a lower daily target to gradually reduce consumption.
            </Text>
          </View>
        </View>
      </View>
  );

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
            <Text style={styles.headerTitle}>Statistics</Text>
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
          <Text style={styles.headerTitle}>Statistics</Text>
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
            showsVerticalScrollIndicator={false}
        >
          <View style={styles.periodSelector}>
            {["weekly", "monthly", "yearly"].map((period) => (
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

          <View style={styles.statsGrid}>
            {getStatCard("Total", summaryStats.total.toString(), "cigarettes", "bar-chart", COLOR.primary)}
            {getStatCard(
                selectedPeriod === "weekly" ? "Weekly Avg" : selectedPeriod === "monthly" ? "Monthly Avg" : "Yearly Avg",
                Math.round(summaryStats.average).toString(),
                selectedPeriod === "weekly" ? "per day" : selectedPeriod === "monthly" ? "per week" : "per month",
                "trending-up",
                COLOR.green
            )}
          </View>

          {/* Enhanced Chart */}
          {renderChart()}

          {/* Trend Analysis with Real Data */}
          {renderTrendAnalysis()}

          {/* Smart Insights */}
          {renderInsights()}
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
  headerTitle: {
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
    marginTop: 20,
    marginBottom: 15,
  },
  periodOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 4,
    backgroundColor: COLOR.lightBackground,
    minWidth: 80,
    alignItems: "center",
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
    color: COLOR.white,
    fontFamily: FONT.bold,
  },
  dateRange: {
    textAlign: "center",
    fontFamily: FONT.medium,
    fontSize: 16,
    color: COLOR.subPrimary,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statCard: {
    width: "45%",
    backgroundColor: COLOR.lightBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: FONT.medium,
    color: COLOR.subPrimary,
    marginLeft: 6,
  },
  statValue: {
    fontSize: 24,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: COLOR.lightBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    textAlign: "center",
  },
  chartContent: {
    flexDirection: "row",
    height: 200,
  },
  yAxisContainer: {
    width: 30,
    height: "100%",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 8,
    paddingVertical: 10,
  },
  yAxisLabel: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
  },
  chartBars: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    height: "100%",
    position: "relative",
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    marginHorizontal: 2,
  },
  barValueContainer: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  valueLabel: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: "center",
  },
  valueLabelText: {
    fontSize: 10,
    fontFamily: FONT.bold,
    color: COLOR.white,
  },
  barContainer: {
    width: "70%",
    height: "75%",
    justifyContent: "flex-end",
  },
  bar: {
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
    marginTop: 8,
    textAlign: "center",
    width: "100%",
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
  trendContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 15,
  },
  trendCards: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trendCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  trendValue: {
    fontSize: 20,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginVertical: 4,
  },
  trendLabel: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
    textAlign: "center",
  },
  insightsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  insightCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLOR.primary,
    lineHeight: 18,
  },
});

export default DetailedStatsModal;