package com.bech.cigpp.service.impl;

import com.bech.cigpp.model.challenge.Challenge;
import com.bech.cigpp.model.challenge.ChallengeStatus;
import com.bech.cigpp.repository.CigaretteLogRepository;
import com.bech.cigpp.service.api.ChallengeProgressService;
import com.bech.cigpp.service.api.ChallengeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@Transactional
public class ChallengeProgressServiceImpl implements ChallengeProgressService {

    private final ChallengeService challengeService;
    private final CigaretteLogRepository cigaretteLogRepository;

    public ChallengeProgressServiceImpl(ChallengeService challengeService, 
                                      CigaretteLogRepository cigaretteLogRepository) {
        this.challengeService = challengeService;
        this.cigaretteLogRepository = cigaretteLogRepository;
    }

    @Override
    public void updateChallengeProgressOnCigaretteLog(String userId, LocalDate date) {
        // Get all active challenges for the user
        List<Challenge> activeChallenges = challengeService.getUserChallenges(userId, ChallengeStatus.ACTIVE);
        
        for (Challenge challenge : activeChallenges) {
            // Check if the date falls within the challenge period
            if (isDateWithinChallenge(date, challenge)) {
                recalculateProgressForChallenge(userId, date, challenge.getChallengeId());
            }
        }
    }

    @Override
    public void recalculateDailyProgress(String userId, LocalDate date) {
        // Get all challenges the user participated in
        List<Challenge> userChallenges = challengeService.getAllUserChallenges(userId);
        
        for (Challenge challenge : userChallenges) {
            if (isDateWithinChallenge(date, challenge)) {
                recalculateProgressForChallenge(userId, date, challenge.getChallengeId());
            }
        }
    }

    @Override
    public void updateChallengeProgressOnCigaretteDelete(String userId, LocalDate date) {
        // Same logic as recalculate - we need to recalculate the entire day's progress
        recalculateDailyProgress(userId, date);
    }

    /**
     * Recalculates progress for a specific challenge on a specific date
     */
    private void recalculateProgressForChallenge(String userId, LocalDate date, Long challengeId) {
        // Count cigarettes for the specific date
        ZoneId zoneId = ZoneId.systemDefault();
        Instant startOfDay = date.atStartOfDay(zoneId).toInstant();
        Instant endOfDay = date.plusDays(1).atStartOfDay(zoneId).toInstant().minusMillis(1);
        
        long cigaretteCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, startOfDay, endOfDay);
        
        // Update challenge progress
        challengeService.updateUserProgress(challengeId, userId, date, (int) cigaretteCount);
    }

    /**
     * Checks if a date falls within a challenge's time period
     */
    private boolean isDateWithinChallenge(LocalDate date, Challenge challenge) {
        LocalDate challengeStartDate = challenge.getStartDate().toLocalDate();
        LocalDate challengeEndDate = challenge.getEndDate().toLocalDate();
        
        return !date.isBefore(challengeStartDate) && !date.isAfter(challengeEndDate);
    }
}