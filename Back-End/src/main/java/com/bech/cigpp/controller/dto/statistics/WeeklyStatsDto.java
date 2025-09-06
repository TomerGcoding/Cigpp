package com.bech.cigpp.controller.dto.statistics;

public record WeeklyStatsDto(
        String day,     // "Mon", "Tue", etc.
        Integer count
) {}
