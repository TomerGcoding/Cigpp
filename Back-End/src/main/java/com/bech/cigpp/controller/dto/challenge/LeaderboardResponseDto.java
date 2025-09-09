package com.bech.cigpp.controller.dto.challenge;

import com.bech.cigpp.model.challenge.ChallengeType;

import java.util.List;

public record LeaderboardResponseDto(
        Long challengeId,
        String challengeTitle,
        ChallengeType challengeType,
        List<LeaderboardEntryDto> leaderboard
) {
}

