package com.bech.cigpp.controller.dto.statistics;

public record DailyStatsDto(
        String hour,    // "12AM", "6AM", etc.
        Integer count
) {}