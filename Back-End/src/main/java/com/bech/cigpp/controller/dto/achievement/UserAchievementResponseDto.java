package com.bech.cigpp.controller.dto.achievement;

import java.time.LocalDateTime;

public record UserAchievementResponseDto(
        Long id,
        AchievementDto achievement,
        LocalDateTime earnedAt,
        Integer progress,
        Boolean isCompleted
) {}
