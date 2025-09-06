package com.bech.cigpp.repository;

import com.bech.cigpp.model.challenge.Challenge;
import com.bech.cigpp.model.challenge.ChallengeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    
    List<Challenge> findByStatus(ChallengeStatus status);
    
    List<Challenge> findByCreatorUserId(String creatorUserId);
    
    @Query("SELECT c FROM Challenge c WHERE c.status = :status AND c.startDate <= :now AND c.endDate > :now")
    List<Challenge> findActiveChallenges(@Param("status") ChallengeStatus status, @Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Challenge c WHERE c.status = 'UPCOMING' AND c.startDate <= :now")
    List<Challenge> findChallengesThatShouldBeActive(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Challenge c WHERE c.status = 'ACTIVE' AND c.endDate <= :now")
    List<Challenge> findChallengesThatShouldBeCompleted(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Challenge c WHERE c.status = :status AND c.challengeId NOT IN " +
           "(SELECT cp.challenge.challengeId FROM ChallengeParticipant cp WHERE cp.userId = :userId)")
    List<Challenge> findAvailableChallenges(@Param("userId") String userId, @Param("status") ChallengeStatus status);
    
    @Query("SELECT c FROM Challenge c JOIN c.participants cp WHERE cp.userId = :userId AND c.status = :status")
    List<Challenge> findUserChallengesByStatus(@Param("userId") String userId, @Param("status") ChallengeStatus status);
    
    @Query("SELECT c FROM Challenge c JOIN c.participants cp WHERE cp.userId = :userId")
    List<Challenge> findAllUserChallenges(@Param("userId") String userId);
    
    @Query("SELECT COUNT(cp) FROM ChallengeParticipant cp WHERE cp.challenge.challengeId = :challengeId")
    Long countParticipants(@Param("challengeId") Long challengeId);
}