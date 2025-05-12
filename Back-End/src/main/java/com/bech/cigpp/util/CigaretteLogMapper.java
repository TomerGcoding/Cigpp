package com.bech.cigpp.util;

import com.bech.cigpp.controller.dto.log.CigaretteLogRequestDto;
import com.bech.cigpp.controller.dto.log.CigaretteLogResponseDto;
import com.bech.cigpp.model.CigaretteLog;

import java.util.List;

public class CigaretteLogMapper {

    public static CigaretteLogResponseDto toResponseDto(CigaretteLog cigaretteLog) {
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

    public static List<CigaretteLogResponseDto> toResponseDtoList(List<CigaretteLog> cigaretteLogs) {
        return cigaretteLogs.stream()
                .map(CigaretteLogMapper::toResponseDto)
                .toList();
    }
}
