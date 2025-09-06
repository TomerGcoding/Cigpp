package com.bech.cigpp.service.impl;

import com.bech.cigpp.controller.dto.statistics.*;
import com.bech.cigpp.model.log.CigaretteLog;
import com.bech.cigpp.repository.CigaretteLogRepository;
import com.bech.cigpp.service.api.StatisticsService;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    private final CigaretteLogRepository cigaretteLogRepository;

    public StatisticsServiceImpl(CigaretteLogRepository cigaretteLogRepository) {
        this.cigaretteLogRepository = cigaretteLogRepository;
    }

    @Override
    public List<DailyStatsDto> getDailyStats(String userId) {
        LocalDate today = LocalDate.now();
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<CigaretteLog> logs = cigaretteLogRepository.findByUserIdAndTimestampBetween(
                userId, startOfDay, endOfDay);

        // Group by hour
        Map<Integer, Long> hourCounts = logs.stream()
                .collect(Collectors.groupingBy(
                        log -> log.getTimestamp().atZone(ZoneId.systemDefault()).getHour(),
                        Collectors.counting()
                ));

        // Create 24-hour data
        return IntStream.range(0, 24)
                .filter(hour -> hour % 3 == 0) // Every 3 hours for display
                .mapToObj(hour -> {
                    String hourLabel = formatHour(hour);
                    Integer count = hourCounts.getOrDefault(hour, 0L).intValue();
                    return new DailyStatsDto(hourLabel, count);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<WeeklyStatsDto> getWeeklyStats(String userId) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(DayOfWeek.MONDAY);

        // Get last 7 days
        return IntStream.range(0, 7)
                .mapToObj(i -> {
                    LocalDate date = weekStart.plusDays(i);
                    Instant startOfDay = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
                    Instant endOfDay = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

                    long count = cigaretteLogRepository.countByUserIdAndTimestampBetween(
                            userId, startOfDay, endOfDay);

                    String dayName = date.getDayOfWeek().toString().substring(0, 3);
                    return new WeeklyStatsDto(dayName, (int) count);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<MonthlyStatsDto> getMonthlyStats(String userId) {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        // Group by weeks
        Map<Integer, List<LocalDate>> weekGroups = new HashMap<>();
        LocalDate current = monthStart;

        while (!current.isAfter(today)) {
            int weekOfMonth = current.get(WeekFields.of(Locale.getDefault()).weekOfMonth());
            weekGroups.computeIfAbsent(weekOfMonth, k -> new ArrayList<>()).add(current);
            current = current.plusDays(1);
        }

        return weekGroups.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    int weekNum = entry.getKey();
                    List<LocalDate> dates = entry.getValue();

                    int totalCount = dates.stream()
                            .mapToInt(date -> {
                                Instant start = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
                                Instant end = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
                                return (int) cigaretteLogRepository.countByUserIdAndTimestampBetween(
                                        userId, start, end);
                            })
                            .sum();

                    return new MonthlyStatsDto("Week " + weekNum, totalCount);
                })
                .collect(Collectors.toList());
    }

    @Override
    public StatsSummaryDto getStatsSummary(String userId, String period) {
        List<Integer> counts;
        String dateRange;

        switch (period.toLowerCase()) {
            case "daily":
                List<DailyStatsDto> dailyStats = getDailyStats(userId);
                counts = dailyStats.stream().map(DailyStatsDto::count).collect(Collectors.toList());
                dateRange = LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd"));
                break;
            case "weekly":
                List<WeeklyStatsDto> weeklyStats = getWeeklyStats(userId);
                counts = weeklyStats.stream().map(WeeklyStatsDto::count).collect(Collectors.toList());
                LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY);
                LocalDate weekEnd = LocalDate.now().with(DayOfWeek.SUNDAY);
                dateRange = weekStart.format(DateTimeFormatter.ofPattern("MMM dd")) +
                        " - " + weekEnd.format(DateTimeFormatter.ofPattern("MMM dd"));
                break;
            case "monthly":
                List<MonthlyStatsDto> monthlyStats = getMonthlyStats(userId);
                counts = monthlyStats.stream().map(MonthlyStatsDto::count).collect(Collectors.toList());
                LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
                LocalDate monthEnd = LocalDate.now();
                dateRange = monthStart.format(DateTimeFormatter.ofPattern("MMM dd")) +
                        " - " + monthEnd.format(DateTimeFormatter.ofPattern("MMM dd"));
                break;
            default:
                return new StatsSummaryDto(0, 0.0, 0, 0, 0, "", "", "");
        }

        if (counts.isEmpty()) {
            return new StatsSummaryDto(0, 0.0, 0, 0, 0, dateRange, "No data available", "");
        }

        int total = counts.stream().mapToInt(Integer::intValue).sum();
        double average = counts.stream().mapToInt(Integer::intValue).average().orElse(0.0);
        int max = counts.stream().mapToInt(Integer::intValue).max().orElse(0);
        int min = counts.stream().mapToInt(Integer::intValue).min().orElse(0);

        // Calculate current streak (simplified)
        int currentStreak = calculateCurrentStreak(userId);

        // Generate insights
        String bestInsight = generateBestInsight(period, counts);
        String worstInsight = generateWorstInsight(period, counts);

        return new StatsSummaryDto(total, average, max, min, currentStreak,
                dateRange, bestInsight, worstInsight);
    }

    private String formatHour(int hour) {
        if (hour == 0) return "12AM";
        if (hour < 12) return hour + "AM";
        if (hour == 12) return "12PM";
        return (hour - 12) + "PM";
    }

    private int calculateCurrentStreak(String userId) {
        // This is a simplified streak calculation
        // You can enhance this based on your streak logic
        LocalDate today = LocalDate.now();
        int streak = 0;

        for (int i = 1; i <= 30; i++) { // Check last 30 days
            LocalDate date = today.minusDays(i);
            Instant start = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant end = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

            long count = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, start, end);

            if (count == 0) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    private String generateBestInsight(String period, List<Integer> counts) {
        if (counts.isEmpty()) return "No data available";

        int minIndex = counts.indexOf(Collections.min(counts));

        switch (period) {
            case "daily":
                String[] hours = {"12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"};
                return hours[minIndex] + " shows the lowest consumption today.";
            case "weekly":
                String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
                return days[minIndex] + " was your best day this week.";
            case "monthly":
                return "Week " + (minIndex + 1) + " had the lowest consumption this month.";
            default:
                return "";
        }
    }

    private String generateWorstInsight(String period, List<Integer> counts) {
        if (counts.isEmpty()) return "";

        int maxIndex = counts.indexOf(Collections.max(counts));

        switch (period) {
            case "daily":
                String[] hours = {"12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"};
                return hours[maxIndex] + " shows peak consumption for today.";
            case "weekly":
                String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
                return days[maxIndex] + " was your highest consumption day this week.";
            case "monthly":
                return "Week " + (maxIndex + 1) + " had the highest consumption this month.";
            default:
                return "";
        }
    }
}
