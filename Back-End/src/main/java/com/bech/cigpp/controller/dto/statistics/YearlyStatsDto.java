package com.bech.cigpp.controller.dto.statistics;

public record YearlyStatsDto(
        String month,    // "Jan", "Feb", etc.
        Integer count
) {}