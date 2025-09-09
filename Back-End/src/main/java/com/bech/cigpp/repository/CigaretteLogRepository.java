package com.bech.cigpp.repository;

import com.bech.cigpp.model.log.CigaretteLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface CigaretteLogRepository extends JpaRepository<CigaretteLog, Long> {
    List<CigaretteLog> findByUserId(String userId);
    List<CigaretteLog> findByTimestampBetween(Instant startDate, Instant endDate);
    List<CigaretteLog> findByUserIdAndTimestampBetween(String userId, Instant startDate, Instant endDate);

    List<CigaretteLog> findByUserIdOrderByTimestampDesc(String userId);

    long countByUserIdAndTimestampBetween(String userId, Instant startOfDay, Instant endOfDay);

    int countByUserId(String userId);
}
