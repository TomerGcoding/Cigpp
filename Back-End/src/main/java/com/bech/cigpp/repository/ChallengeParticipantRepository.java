package com.bech.cigpp.repository;

import com.bech.cigpp.model.challenge.ChallengeParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeParticipantRepository extends JpaRepository<ChallengeParticipant, Long> {
    
    @Query("SELECT cp FROM ChallengeParticipant cp WHERE cp.challenge.challengeId = :challengeId")
    List<ChallengeParticipant> findByChallengeId(@Param("challengeId") Long challengeId);
    
    List<ChallengeParticipant> findByUserId(String userId);
    
    @Query("SELECT cp FROM ChallengeParticipant cp WHERE cp.challenge.challengeId = :challengeId AND cp.userId = :userId")
    Optional<ChallengeParticipant> findByChallengeIdAndUserId(@Param("challengeId") Long challengeId, @Param("userId") String userId);
    
    @Query("SELECT cp FROM ChallengeParticipant cp WHERE cp.challenge.challengeId = :challengeId AND cp.userId = :userId")
    Optional<ChallengeParticipant> findByUserAndChallenge(@Param("userId") String userId, @Param("challengeId") Long challengeId);
    
    @Query("SELECT COUNT(cp) FROM ChallengeParticipant cp WHERE cp.challenge.challengeId = :challengeId")
    Long countByChallengeId(@Param("challengeId") Long challengeId);
    
    @Query("SELECT COUNT(cp) FROM ChallengeParticipant cp WHERE cp.userId = :userId")
    Long countByUserId(@Param("userId") String userId);
    
    @Query("SELECT CASE WHEN COUNT(cp) > 0 THEN true ELSE false END FROM ChallengeParticipant cp WHERE cp.challenge.challengeId = :challengeId AND cp.userId = :userId")
    boolean existsByChallengeIdAndUserId(@Param("challengeId") Long challengeId, @Param("userId") String userId);
    
    @Modifying
    @Query("DELETE FROM ChallengeParticipant cp WHERE cp.challenge.challengeId = :challengeId AND cp.userId = :userId")
    void deleteByChallengeIdAndUserId(@Param("challengeId") Long challengeId, @Param("userId") String userId);
    
    @Query("SELECT cp.userId FROM ChallengeParticipant cp WHERE cp.challenge.challengeId = :challengeId ORDER BY cp.joinedAt")
    List<String> findParticipantUserIdsByChallengeId(@Param("challengeId") Long challengeId);
}