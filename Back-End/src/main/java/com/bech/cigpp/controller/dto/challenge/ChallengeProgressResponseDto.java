package com.bech.cigpp.controller.dto.challenge;

public record ChallengeProgressResponseDto(
        Long challengeId,
        String userId,
        Integer totalCigarettesSmoked,
        Integer totalPoints,
        Integer currentRank,
        Integer personalTarget
) {
}