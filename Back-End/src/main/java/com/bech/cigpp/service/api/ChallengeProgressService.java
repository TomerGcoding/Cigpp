package com.bech.cigpp.service.api;

import java.time.LocalDate;

public interface ChallengeProgressService {
    
    /**
     * Updates challenge progress for all active challenges when a cigarette is logged
     * @param userId The user who logged the cigarette
     * @param date The date of the cigarette log
     */
    void updateChallengeProgressOnCigaretteLog(String userId, LocalDate date);
    
    /**
     * Recalculates daily progress for a user on a specific date
     * @param userId The user ID
     * @param date The date to recalculate
     */
    void recalculateDailyProgress(String userId, LocalDate date);
    
    /**
     * Updates progress when a cigarette log is deleted
     * @param userId The user who deleted the cigarette log
     * @param date The date of the deleted cigarette log
     */
    void updateChallengeProgressOnCigaretteDelete(String userId, LocalDate date);
}