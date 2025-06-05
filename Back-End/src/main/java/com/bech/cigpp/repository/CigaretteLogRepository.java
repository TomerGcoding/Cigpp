package com.bech.cigpp.repository;

import com.bech.cigpp.model.log.CigaretteLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface CigaretteLogRepository extends JpaRepository<CigaretteLog, Long> {
    List<CigaretteLog> findByUserId(String userId);
    List<CigaretteLog> findByDateBetween(Instant startDate, Instant endDate);
    List<CigaretteLog> findByUserIdAndDateBetween(String userId, Instant startDate, Instant endDate);
}
