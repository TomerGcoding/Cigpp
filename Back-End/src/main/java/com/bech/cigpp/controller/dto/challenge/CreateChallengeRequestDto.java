package com.bech.cigpp.controller.dto.challenge;

import com.bech.cigpp.model.challenge.ChallengeType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateChallengeRequestDto(
        @NotBlank(message = "Challenge title is required")
        String title,
        
        String description,
        
        @NotNull(message = "Challenge type is required")
        ChallengeType challengeType,
        
        @NotNull(message = "Time frame is required")
        @Min(value = 1, message = "Time frame must be at least 1 day")
        Integer timeFrameDays,
        
        @NotNull(message = "Start date is required")
        LocalDateTime startDate,

        Integer personalTarget
) {
}