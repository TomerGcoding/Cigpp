package com.bech.cigpp.service.api;

import com.bech.cigpp.controller.dto.statistics.*;
import java.util.List;

public interface StatisticsService {
    List<DailyStatsDto> getDailyStats(String userId);
    List<WeeklyStatsDto> getWeeklyStats(String userId);
    List<MonthlyStatsDto> getMonthlyStats(String userId);
    StatsSummaryDto getStatsSummary(String userId, String period);
}