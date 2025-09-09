package com.bech.cigpp.controller.dto.challenge;

public record LeaderboardEntryDto(
        Integer rank,
        String userId,
        String userName,
        Integer cigarettesSmoked,
        Integer points
) {
}
