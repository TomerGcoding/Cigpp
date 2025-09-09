package com.bech.cigpp.service.api;

import com.bech.cigpp.controller.dto.statistics.*;
import java.util.List;

public interface StatisticsService {
    List<WeeklyStatsDto> getWeeklyStats(String userId);
    List<MonthlyStatsDto> getMonthlyStats(String userId);
    List<YearlyStatsDto> getYearlyStats(String userId);
    StatsSummaryDto getStatsSummary(String userId, String period);
    TrendDataDto getTrendData(String userId, String period, Integer targetConsumption);
}