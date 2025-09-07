package com.bech.cigpp.service.api;

import com.bech.cigpp.model.challenge.Challenge;
import com.bech.cigpp.model.challenge.ChallengeStatus;
import com.bech.cigpp.model.challenge.ChallengeType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ChallengeService {
    
    // Challenge lifecycle management
    Challenge createChallenge(String title, String description, ChallengeType challengeType, 
                            Integer timeFrameDays, LocalDateTime startDate, String creatorUserId,Integer personalTarget);
    
    Optional<Challenge> getChallengeById(Long challengeId);
    
    List<Challenge> getAvailableChallenges(String userId);
    
    List<Challenge> getUserChallenges(String userId, ChallengeStatus status);
    
    List<Challenge> getAllUserChallenges(String userId);
    
    List<Challenge> getChallengesByCreator(String creatorUserId);
    
    Challenge updateChallenge(Long challengeId, String title, String description, String updaterUserId);
    
    void deleteChallenge(Long challengeId, String deleterUserId);
    
    // Participation management  
    void joinChallenge(Long challengeId, String userId, Integer personalTarget);
    
    void leaveChallenge(Long challengeId, String userId);
    
    boolean isUserInChallenge(Long challengeId, String userId);
    
    Long getChallengeParticipantCount(Long challengeId);
    
    List<String> getChallengeParticipants(Long challengeId);
    
    // Progress and leaderboard
    Map<String, Object> getLeaderboard(Long challengeId);
    
    Map<String, Object> getUserProgress(Long challengeId, String userId);
    
    void updateUserProgress(Long challengeId, String userId, LocalDate date, Integer cigarettesSmoked);
    
    // Challenge status management (for scheduled tasks)
    void activateUpcomingChallenges();
    
    void completeActiveChallenges();
    
    void updateChallengeStatus(Long challengeId, ChallengeStatus status);
    
    // Statistics and analytics
    Map<String, Object> getChallengeStatistics(Long challengeId);
    
    Map<String, Object> getUserChallengeStats(String userId);

    List<Challenge> getChallengesByStatusAndUser(ChallengeStatus status, String userId);
}