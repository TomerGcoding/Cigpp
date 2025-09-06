package com.bech.cigpp.controller.dto.challenge;

import com.bech.cigpp.model.challenge.ChallengeStatus;

public record ChallengeStatisticsResponseDto(
        Long challengeId,
        String title,
        ChallengeStatus status,
        Long participantCount,
        Long activeParticipants
) {
}