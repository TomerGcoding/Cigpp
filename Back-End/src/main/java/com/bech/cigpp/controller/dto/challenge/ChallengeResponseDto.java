package com.bech.cigpp.controller.dto.challenge;

import com.bech.cigpp.model.challenge.ChallengeStatus;
import com.bech.cigpp.model.challenge.ChallengeType;

import java.time.LocalDateTime;

public record ChallengeResponseDto(
        Long challengeId,
        String title,
        String description,
        ChallengeType challengeType,
        String challengeTypeName,
        Integer timeFrameDays,
        String timeFrame,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String creatorUserId,
        ChallengeStatus status,
        Long participantCount,
        Boolean joined,
        ChallengeProgressResponseDto personalProgress
) {
}