package com.bech.cigpp.service.api;

import com.bech.cigpp.controller.dto.log.CigaretteLogRequestDto;
import com.bech.cigpp.controller.dto.log.CigaretteLogResponseDto;
import com.bech.cigpp.model.CigaretteLog;

import java.time.Instant;
import java.util.List;

public interface CigaretteLogService {

    CigaretteLogResponseDto addCigaretteLog(CigaretteLogRequestDto cigaretteLogDto);

    List<CigaretteLogResponseDto> getCigaretteLogs(String userId);

    List<CigaretteLogResponseDto> getCigaretteLogsBetweenDates(String userId, Instant startDate, Instant endDate);

    List<CigaretteLogResponseDto> getTodaysCigaretteLogs(String userId);

    CigaretteLogResponseDto deleteCigaretteLog(Long id);

}
