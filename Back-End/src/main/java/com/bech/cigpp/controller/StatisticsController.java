package com.bech.cigpp.controller;

import com.bech.cigpp.controller.dto.statistics.*;
import com.bech.cigpp.service.api.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/daily/{userId}")
    public ResponseEntity<List<DailyStatsDto>> getDailyStats(@PathVariable String userId) {
        List<DailyStatsDto> stats = statisticsService.getDailyStats(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/weekly/{userId}")
    public ResponseEntity<List<WeeklyStatsDto>> getWeeklyStats(@PathVariable String userId) {
        List<WeeklyStatsDto> stats = statisticsService.getWeeklyStats(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/monthly/{userId}")
    public ResponseEntity<List<MonthlyStatsDto>> getMonthlyStats(@PathVariable String userId) {
        List<MonthlyStatsDto> stats = statisticsService.getMonthlyStats(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/summary/{userId}")
    public ResponseEntity<StatsSummaryDto> getStatsSummary(
            @PathVariable String userId,
            @RequestParam String period) {
        StatsSummaryDto summary = statisticsService.getStatsSummary(userId, period);
        return ResponseEntity.ok(summary);
    }
}