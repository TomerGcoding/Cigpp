package com.bech.cigpp.controller.dto.achievement;

public record AchievementDto(
        Long id,
        String name,
        String description,
        String iconName
) {}
