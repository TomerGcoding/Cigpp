package com.bech.cigpp.service.api;

import com.bech.cigpp.model.CigaretteLog;

import java.time.Instant;
import java.util.List;

public interface CigaretteLogService {

    void addCigaretteLog(String userId, String description, Instant date);

    List<CigaretteLog> getCigaretteLogs(String userId);

    List<CigaretteLog> getCigaretteLogsBetweenDates(String userId, Instant startDate, Instant endDate);

    void deleteCigaretteLog(Long id);

}
