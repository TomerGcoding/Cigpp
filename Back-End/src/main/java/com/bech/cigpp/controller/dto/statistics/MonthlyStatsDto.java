package com.bech.cigpp.controller.dto.statistics;

public record MonthlyStatsDto(
        String week,    // "Week 1", "Week 2", etc.
        Integer count
) {}
