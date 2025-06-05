package com.bech.cigpp.controller.dto.log;

import java.time.Instant;

public record CigaretteLogRequestDto(
        String userId,
        String deviceId,
        String description,
        Instant timestamp
) {
}
