package com.bech.cigpp.service.impl;

import com.bech.cigpp.controller.dto.statistics.*;
import com.bech.cigpp.model.log.CigaretteLog;
import com.bech.cigpp.repository.CigaretteLogRepository;
import com.bech.cigpp.service.api.StatisticsService;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
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
    public List<WeeklyStatsDto> getWeeklyStats(String userId) {
        LocalDate today = LocalDate.now();

        // Start from Sunday instead of Monday
        LocalDate weekStart;
        if (today.getDayOfWeek() == DayOfWeek.SUNDAY) {
            weekStart = today;
        } else {
            weekStart = today.with(DayOfWeek.SUNDAY).minusWeeks(1);
        }

        // Get 7 days starting from Sunday
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
    public List<YearlyStatsDto> getYearlyStats(String userId) {
        LocalDate today = LocalDate.now();
        LocalDate yearStart = today.withDayOfYear(1);

        // Group by months
        Map<Integer, Integer> monthGroups = new HashMap<>();

        for (int month = 1; month <= 12; month++) {
            LocalDate monthStart = yearStart.withMonth(month);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);

            // Don't process future months
            if (monthStart.isAfter(today)) {
                break;
            }

            // Adjust end date for current month
            if (monthEnd.isAfter(today)) {
                monthEnd = today;
            }

            Instant start = monthStart.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant end = monthEnd.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

            int totalCount = (int) cigaretteLogRepository.countByUserIdAndTimestampBetween(
                    userId, start, end);

            monthGroups.put(month, totalCount);
        }

        return monthGroups.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    String monthName = Month.of(entry.getKey()).getDisplayName(
                            TextStyle.SHORT, Locale.ENGLISH);
                    return new YearlyStatsDto(monthName, entry.getValue());
                })
                .collect(Collectors.toList());
    }

    @Override
    public StatsSummaryDto getStatsSummary(String userId, String period) {
        List<Integer> counts;
        String dateRange;

        switch (period.toLowerCase()) {
            case "weekly": {
                List<WeeklyStatsDto> weeklyStats = getWeeklyStats(userId);
                counts = weeklyStats.stream().map(WeeklyStatsDto::count).collect(Collectors.toList());
                LocalDate today = LocalDate.now();
                LocalDate weekStart = (today.getDayOfWeek() == DayOfWeek.SUNDAY)
                        ? today
                        : today.with(DayOfWeek.SUNDAY).minusWeeks(1);
                LocalDate weekEnd = weekStart.plusDays(6); // Saturday
                dateRange = weekStart.format(DateTimeFormatter.ofPattern("MMM dd")) +
                        " - " + weekEnd.format(DateTimeFormatter.ofPattern("MMM dd"));
                break;
            }
            case "monthly": {
                List<MonthlyStatsDto> monthlyStats = getMonthlyStats(userId);
                counts = monthlyStats.stream().map(MonthlyStatsDto::count).collect(Collectors.toList());
                LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
                LocalDate monthEnd = LocalDate.now();
                dateRange = monthStart.format(DateTimeFormatter.ofPattern("MMM dd")) +
                        " - " + monthEnd.format(DateTimeFormatter.ofPattern("MMM dd"));
                break;
            }
            case "yearly": {
                List<YearlyStatsDto> yearlyStats = getYearlyStats(userId);
                counts = yearlyStats.stream().map(YearlyStatsDto::count).collect(Collectors.toList());

                // Adjust date range to start at the first active month in the current year
                LocalDate now = LocalDate.now();
                YearMonth currentYm = YearMonth.from(now);

                // Find first non-zero month index (0=Jan, 11=Dec)
                int firstActiveIdx = -1;
                for (int i = 0; i < counts.size(); i++) {
                    if (counts.get(i) != null && counts.get(i) > 0) {
                        firstActiveIdx = i;
                        break;
                    }
                }

                // Build dateRange: from first active month (or Jan if none) to today
                YearMonth startYm = (firstActiveIdx >= 0)
                        ? YearMonth.of(currentYm.getYear(), firstActiveIdx + 1)
                        : YearMonth.of(currentYm.getYear(), 1);

                LocalDate yearStart = startYm.atDay(1);
                LocalDate yearEnd = now;
                dateRange = yearStart.format(DateTimeFormatter.ofPattern("MMM dd")) +
                        " - " + yearEnd.format(DateTimeFormatter.ofPattern("MMM dd"));

                break;
            }
            default:
                return new StatsSummaryDto(0, 0.0, 0, 0, "", "No data available", "");
        }

        if (counts == null || counts.isEmpty()) {
            return new StatsSummaryDto(0, 0.0, 0, 0, dateRange, "No data available", "");
        }

        int total = counts.stream().mapToInt(x -> x == null ? 0 : x).sum();

        double average;
        if ("yearly".equalsIgnoreCase(period)) {
            // Average per "active" month only (skip leading months with zero before first log)
            int firstActiveIdx = -1;
            for (int i = 0; i < counts.size(); i++) {
                Integer c = counts.get(i);
                if (c != null && c > 0) { firstActiveIdx = i; break; }
            }
            if (firstActiveIdx == -1) {
                average = 0.0;
            } else {
                List<Integer> activeSlice = counts.subList(firstActiveIdx, counts.size());
                int monthsActive = activeSlice.size(); // from first non-zero to now (inclusive)
                int activeSum = activeSlice.stream().mapToInt(x -> x == null ? 0 : x).sum();
                average = monthsActive > 0 ? (activeSum / (double) monthsActive) : 0.0;
            }
        } else {
            // Weekly/monthly behavior unchanged
            average = counts.stream().mapToInt(x -> x == null ? 0 : x).average().orElse(0.0);
        }

        int max = counts.stream().mapToInt(x -> x == null ? 0 : x).max().orElse(0);
        int min = counts.stream().mapToInt(x -> x == null ? 0 : x).min().orElse(0);

        String bestInsight = generateBestInsight(period, counts);
        String worstInsight = generateWorstInsight(period, counts);

        return new StatsSummaryDto(total, average, max, min, dateRange, bestInsight, worstInsight);
    }


    @Override
    public TrendDataDto getTrendData(String userId, String period, Integer targetConsumption) {
        LocalDate today = LocalDate.now();
        LocalDate currentPeriodStart;
        LocalDate currentPeriodEnd = today;
        LocalDate previousPeriodStart;
        LocalDate previousPeriodEnd;

        // Define periods based on selected period
        switch (period.toLowerCase()) {
            case "weekly":
                if (today.getDayOfWeek() == DayOfWeek.SUNDAY) {
                    currentPeriodStart = today;
                } else {
                    currentPeriodStart = today.with(DayOfWeek.SUNDAY).minusWeeks(1);
                }
                currentPeriodEnd = currentPeriodStart.plusDays(6); // Saturday
                previousPeriodStart = currentPeriodStart.minusWeeks(1);
                previousPeriodEnd = currentPeriodStart.minusDays(1);
                break;
            case "monthly":
                currentPeriodStart = today.withDayOfMonth(1);
                previousPeriodStart = currentPeriodStart.minusMonths(1);
                previousPeriodEnd = currentPeriodStart.minusDays(1);
                break;
            case "yearly":
                currentPeriodStart = today.withDayOfYear(1);
                previousPeriodStart = currentPeriodStart.minusYears(1);
                previousPeriodEnd = currentPeriodStart.minusDays(1);
                break;
            default:
                return new TrendDataDto(0, 0, "");
        }

        // Calculate current period consumption
        Instant currentStart = currentPeriodStart.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant currentEnd = currentPeriodEnd.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        long currentCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, currentStart, currentEnd);

        // Calculate previous period consumption
        Instant previousStart = previousPeriodStart.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant previousEnd = previousPeriodEnd.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        long previousCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, previousStart, previousEnd);

        // Calculate percentage change
        int percentageChange = 0;
        if (previousCount > 0) {
            percentageChange = (int) Math.round(((double) (currentCount - previousCount) / previousCount) * 100);
        } else if (currentCount > 0) {
            percentageChange = 100; // If no previous data but current data exists
        }

        // Calculate days below target
        int daysBelow = calculateDaysBelowTarget(userId, currentPeriodStart, currentPeriodEnd, targetConsumption);

        // Find peak period
        String peakPeriod = findPeakPeriod(userId, currentPeriodStart, currentPeriodEnd, period);

        return new TrendDataDto(percentageChange, daysBelow, peakPeriod);
    }

    private int calculateDaysBelowTarget(String userId, LocalDate startDate, LocalDate endDate, Integer targetConsumption) {
        if (targetConsumption == null || targetConsumption <= 0) {
            return 0;
        }

        int daysBelow = 0;
        LocalDate current = startDate;

        while (!current.isAfter(endDate) && !current.isAfter(LocalDate.now())) {
            Instant dayStart = current.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant dayEnd = current.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

            long dayCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, dayStart, dayEnd);

            if (dayCount < targetConsumption) {
                daysBelow++;
            }

            current = current.plusDays(1);
        }

        return daysBelow;
    }

    private String findPeakPeriod(String userId, LocalDate startDate, LocalDate endDate, String period) {
        Map<String, Long> periodCounts = new HashMap<>();

        switch (period.toLowerCase()) {
            case "weekly":
                // Find peak day of week
                LocalDate current = startDate;
                while (!current.isAfter(endDate) && !current.isAfter(LocalDate.now())) {
                    Instant dayStart = current.atStartOfDay(ZoneId.systemDefault()).toInstant();
                    Instant dayEnd = current.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

                    long dayCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, dayStart, dayEnd);
                    String dayName = current.getDayOfWeek().toString().substring(0, 3);

                    periodCounts.put(dayName, dayCount);
                    current = current.plusDays(1);
                }
                break;

            case "monthly":
                // Find peak week
                LocalDate weekStart = startDate;
                int weekNumber = 1;

                while (!weekStart.isAfter(endDate)) {
                    LocalDate weekEnd = weekStart.plusDays(6);
                    if (weekEnd.isAfter(endDate)) {
                        weekEnd = endDate;
                    }

                    Instant start = weekStart.atStartOfDay(ZoneId.systemDefault()).toInstant();
                    Instant end = weekEnd.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

                    long weekCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, start, end);
                    periodCounts.put("Week " + weekNumber, weekCount);

                    weekStart = weekStart.plusWeeks(1);
                    weekNumber++;
                }
                break;

            case "yearly":
                // Find peak month
                for (int month = 1; month <= 12; month++) {
                    if (startDate.getYear() == LocalDate.now().getYear() && month > LocalDate.now().getMonthValue()) {
                        break; // Don't check future months
                    }

                    LocalDate monthStart = LocalDate.of(startDate.getYear(), month, 1);
                    LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);

                    if (monthEnd.isAfter(LocalDate.now())) {
                        monthEnd = LocalDate.now();
                    }

                    Instant start = monthStart.atStartOfDay(ZoneId.systemDefault()).toInstant();
                    Instant end = monthEnd.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

                    long monthCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, start, end);
                    String monthName = Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

                    periodCounts.put(monthName, monthCount);
                }
                break;

            default:
                return "";
        }

        // Find the period with maximum count
        return periodCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("");
    }

    private String generateBestInsight(String period, List<Integer> counts) {
        if (counts.isEmpty()) return "No data available";

        int minIndex = counts.indexOf(Collections.min(counts));

        switch (period) {
            case "weekly":
                String[] days = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
                return days[minIndex] + " was your best day this week.";
            case "monthly":
                return "Week " + (minIndex + 1) + " had the lowest consumption this month.";
            case "yearly":
                String[] months = {"January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"};
                return months[minIndex] + " had the lowest consumption this year.";
            default:
                return "";
        }
    }

    private String generateWorstInsight(String period, List<Integer> counts) {
        if (counts.isEmpty()) return "";

        int maxIndex = counts.indexOf(Collections.max(counts));

        switch (period) {
            case "weekly":
                String[] days = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
                return days[maxIndex] + " was your highest consumption day this week.";
            case "monthly":
                return "Week " + (maxIndex + 1) + " had the highest consumption this month.";
            case "yearly":
                String[] months = {"January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"};
                return months[maxIndex] + " had the highest consumption this year.";
            default:
                return "";
        }
    }
}