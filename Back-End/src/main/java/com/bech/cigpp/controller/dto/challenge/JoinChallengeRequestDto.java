package com.bech.cigpp.controller.dto.challenge;

import jakarta.validation.constraints.Min;

public record JoinChallengeRequestDto(
        @Min(value = 1, message = "Personal target must be at least 1")
        Integer personalTarget
) {
}