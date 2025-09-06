package com.bech.cigpp.controller.dto.statistics;

public record StatsSummaryDto(
        Integer total,
        Double average,
        Integer max,
        Integer min,
        Integer currentStreak,
        String dateRange,
        String bestInsight,
        String worstInsight
) {}
