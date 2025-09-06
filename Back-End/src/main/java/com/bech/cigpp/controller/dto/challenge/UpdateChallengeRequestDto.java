package com.bech.cigpp.controller.dto.challenge;

import jakarta.validation.constraints.NotBlank;

public record UpdateChallengeRequestDto(
        @NotBlank(message = "Challenge title is required")
        String title,
        
        String description
) {
}