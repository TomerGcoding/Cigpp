package com.bech.cigpp.controller.dto.log;

import java.time.Instant;

public record CigaretteLogResponseDto (
        Long id,
        String userId,
        String description,
        Instant timestamp
) {
}
