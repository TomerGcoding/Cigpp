package com.bech.cigpp.util;

import com.bech.cigpp.controller.dto.log.CigaretteLogRequestDto;
import com.bech.cigpp.controller.dto.log.CigaretteLogResponseDto;
import com.bech.cigpp.model.CigaretteLog;

public class CigaretteLogMapper {

    public static CigaretteLogResponseDto toRequestDto(CigaretteLog cigaretteLog) {
        return new CigaretteLogResponseDto(
                cigaretteLog.getId(),
                cigaretteLog.getUserId(),
                cigaretteLog.getDescription(),
                cigaretteLog.getDate()
        );
    }

    public static CigaretteLog toEntity(CigaretteLogRequestDto cigaretteLogDto) {
        return CigaretteLog.builder()
                .userId(cigaretteLogDto.userId())
                .description(cigaretteLogDto.description())
                .date(cigaretteLogDto.date())
                .build();
    }
}
