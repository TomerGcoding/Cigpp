package com.bech.cigpp.controller.dto.statistics;

public record TrendDataDto(
        Integer percentageChange,
        Integer daysBelow,
        String peakPeriod
) {}