package com.bech.cigpp.repository;

import com.bech.cigpp.model.challenge.ChallengeProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeProgressRepository extends JpaRepository<ChallengeProgress, Long> {
    
    @Query("SELECT cp FROM ChallengeProgress cp WHERE cp.challenge.challengeId = :challengeId")
    List<ChallengeProgress> findByChallengeId(@Param("challengeId") Long challengeId);
    
    List<ChallengeProgress> findByUserId(String userId);
    
    @Query("SELECT cp FROM ChallengeProgress cp WHERE cp.challenge.challengeId = :challengeId AND cp.userId = :userId")
    List<ChallengeProgress> findByChallengeIdAndUserId(@Param("challengeId") Long challengeId, @Param("userId") String userId);
    
    @Query("SELECT cp FROM ChallengeProgress cp WHERE cp.challenge.challengeId = :challengeId AND cp.userId = :userId AND cp.date = :date")
    Optional<ChallengeProgress> findByChallengeIdAndUserIdAndDate(@Param("challengeId") Long challengeId, @Param("userId") String userId, @Param("date") LocalDate date);
    
    @Query("SELECT cp FROM ChallengeProgress cp WHERE cp.challenge.challengeId = :challengeId AND cp.date BETWEEN :startDate AND :endDate ORDER BY cp.date")
    List<ChallengeProgress> findByChallengeAndDateRange(@Param("challengeId") Long challengeId, 
                                                       @Param("startDate") LocalDate startDate, 
                                                       @Param("endDate") LocalDate endDate);
    
    @Query("SELECT cp FROM ChallengeProgress cp WHERE cp.userId = :userId AND cp.date BETWEEN :startDate AND :endDate ORDER BY cp.date")
    List<ChallengeProgress> findByUserAndDateRange(@Param("userId") String userId, 
                                                   @Param("startDate") LocalDate startDate, 
                                                   @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(cp.cigarettesSmoked) FROM ChallengeProgress cp WHERE cp.challenge.challengeId = :challengeId AND cp.userId = :userId")
    Optional<Integer> getTotalCigarettesSmokedByUser(@Param("challengeId") Long challengeId, @Param("userId") String userId);
    
    @Query("SELECT SUM(cp.pointsEarned) FROM ChallengeProgress cp WHERE cp.challenge.challengeId = :challengeId AND cp.userId = :userId")
    Optional<Integer> getTotalPointsByUser(@Param("challengeId") Long challengeId, @Param("userId") String userId);
    
    @Query("SELECT cp.userId, SUM(cp.cigarettesSmoked) as totalCigs FROM ChallengeProgress cp " +
           "WHERE cp.challenge.challengeId = :challengeId " +
           "GROUP BY cp.userId ORDER BY totalCigs ASC")
    List<Object[]> getLeaderboardByCigarettes(@Param("challengeId") Long challengeId);
    
    @Query("SELECT cp.userId, SUM(cp.pointsEarned) as totalPoints FROM ChallengeProgress cp " +
           "WHERE cp.challenge.challengeId = :challengeId " +
           "GROUP BY cp.userId ORDER BY totalPoints DESC")
    List<Object[]> getLeaderboardByPoints(@Param("challengeId") Long challengeId);
    
    @Query("SELECT DISTINCT cp.date FROM ChallengeProgress cp WHERE cp.challenge.challengeId = :challengeId ORDER BY cp.date")
    List<LocalDate> getActiveDatesForChallenge(@Param("challengeId") Long challengeId);
    
    @Query("SELECT COUNT(DISTINCT cp.userId) FROM ChallengeProgress cp WHERE cp.challenge.challengeId = :challengeId")
    Long countActiveParticipants(@Param("challengeId") Long challengeId);
    
    @Query("SELECT CASE WHEN COUNT(cp) > 0 THEN true ELSE false END FROM ChallengeProgress cp WHERE cp.challenge.challengeId = :challengeId AND cp.userId = :userId AND cp.date = :date")
    boolean existsByChallengeIdAndUserIdAndDate(@Param("challengeId") Long challengeId, @Param("userId") String userId, @Param("date") LocalDate date);
}