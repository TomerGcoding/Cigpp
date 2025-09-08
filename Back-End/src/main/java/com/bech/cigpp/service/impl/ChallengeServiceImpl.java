package com.bech.cigpp.service.impl;

import com.bech.cigpp.exception.ResourceNotFoundException;
import com.bech.cigpp.model.challenge.*;
import com.bech.cigpp.repository.ChallengeParticipantRepository;
import com.bech.cigpp.repository.ChallengeProgressRepository;
import com.bech.cigpp.repository.ChallengeRepository;
import com.bech.cigpp.service.api.ChallengeService;
import com.bech.cigpp.service.api.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ChallengeParticipantRepository participantRepository;
    private final ChallengeProgressRepository progressRepository;
    private final UserService userService;

    public ChallengeServiceImpl(ChallengeRepository challengeRepository,
                               ChallengeParticipantRepository participantRepository,
                               ChallengeProgressRepository progressRepository,
                               UserService userService) {
        this.challengeRepository = challengeRepository;
        this.participantRepository = participantRepository;
        this.progressRepository = progressRepository;
        this.userService = userService;
    }

    @Override
    public Challenge createChallenge(String title, String description, ChallengeType challengeType,
                                   Integer timeFrameDays, LocalDateTime startDate, String creatorUserId, Integer personalTarget) {
        validateChallengeInputForCreation(title, challengeType, timeFrameDays);
        
        Challenge challenge = new Challenge();
        challenge.setTitle(title);
        challenge.setDescription(description);
        challenge.setChallengeType(challengeType);
        challenge.setTimeFrameDays(timeFrameDays);
        // Don't set start and end dates until challenge is manually started
        challenge.setStartDate(null);
        challenge.setEndDate(null);
        challenge.setCreatorUserId(creatorUserId);
        challenge.setStatus(ChallengeStatus.UPCOMING);
        
        Challenge savedChallenge = challengeRepository.save(challenge);
        
        // Automatically join creator to the challenge
        joinChallenge(savedChallenge.getChallengeId(), creatorUserId, personalTarget);
        
        return savedChallenge;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Challenge> getChallengeById(Long challengeId) {
        return challengeRepository.findById(challengeId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Challenge> getAvailableChallenges(String userId) {
        return challengeRepository.findAllUserChallenges(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Challenge> getChallengesByStatusAndUser(ChallengeStatus status, String userId){return challengeRepository.findAllByUserAndStatus(userId, status);}

    @Override
    @Transactional(readOnly = true)
    public List<Challenge> getUserChallenges(String userId, ChallengeStatus status) {
        return challengeRepository.findUserChallengesByStatus(userId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Challenge> getAllUserChallenges(String userId) {
        return challengeRepository.findAllUserChallenges(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Challenge> getChallengesByCreator(String creatorUserId) {
        return challengeRepository.findByCreatorUserId(creatorUserId);
    }

    @Override
    public Challenge updateChallenge(Long challengeId, String title, String description, String updaterUserId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));
        
        if (!challenge.getCreatorUserId().equals(updaterUserId)) {
            throw new IllegalArgumentException("Only the creator can update the challenge");
        }
        
        if (challenge.getStatus() != ChallengeStatus.UPCOMING) {
            throw new IllegalStateException("Cannot update challenge that has already started");
        }
        
        challenge.setTitle(title);
        challenge.setDescription(description);
        
        return challengeRepository.save(challenge);
    }

    @Override
    public void deleteChallenge(Long challengeId, String deleterUserId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));
        
        if (!challenge.getCreatorUserId().equals(deleterUserId)) {
            throw new IllegalArgumentException("Only the creator can delete the challenge");
        }
        
        if (challenge.getStatus() == ChallengeStatus.ACTIVE) {
            throw new IllegalStateException("Cannot delete an active challenge");
        }
        
        challengeRepository.delete(challenge);
    }

    @Override
    public Challenge startChallenge(Long challengeId, String creatorUserId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));
        
        if (!challenge.getCreatorUserId().equals(creatorUserId)) {
            throw new IllegalArgumentException("Only the creator can start the challenge");
        }
        
        if (challenge.getStatus() != ChallengeStatus.UPCOMING) {
            throw new IllegalStateException("Only upcoming challenges can be started");
        }
        
        // Set start date to now and calculate new end date
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = now.plusDays(challenge.getTimeFrameDays());
        
        challenge.setStartDate(now);
        challenge.setEndDate(endDate);
        challenge.setStatus(ChallengeStatus.ACTIVE);
        
        return challengeRepository.save(challenge);
    }

    @Override
    public void joinChallenge(Long challengeId, String userId, Integer personalTarget) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));
        
        if (challenge.getStatus() == ChallengeStatus.COMPLETED) {
            throw new IllegalStateException("Cannot join a completed challenge");
        }
        
        if (participantRepository.existsByChallengeIdAndUserId(challengeId, userId)) {
            throw new IllegalArgumentException("User is already participating in this challenge");
        }
        
        if (challenge.getChallengeType() == ChallengeType.DAILY_TARGET_POINTS && personalTarget == null) {
            throw new IllegalArgumentException("Personal target is required for Daily Target Points challenges");
        }
        
        ChallengeParticipant participant = new ChallengeParticipant();
        participant.setChallenge(challenge);
        participant.setUserId(userId);
        participant.setPersonalTarget(personalTarget);
        participant.setJoinedAt(LocalDateTime.now());
        
        participantRepository.save(participant);
    }

    @Override
    public void leaveChallenge(Long challengeId, String userId) {
        if (!participantRepository.existsByChallengeIdAndUserId(challengeId, userId)) {
            throw new IllegalArgumentException("User is not participating in this challenge");
        }
        
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));
        
        if (challenge.getCreatorUserId().equals(userId)) {
            throw new IllegalArgumentException("Challenge creator cannot leave their own challenge");
        }
        
        participantRepository.deleteByChallengeIdAndUserId(challengeId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserInChallenge(Long challengeId, String userId) {
        return participantRepository.existsByChallengeIdAndUserId(challengeId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getChallengeParticipantCount(Long challengeId) {
        return participantRepository.countByChallengeId(challengeId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getChallengeParticipants(Long challengeId) {
        return participantRepository.findParticipantUserIdsByChallengeId(challengeId);
    }

//    @Override
//    @Transactional(readOnly = true)
//    public Map<String, Object> getLeaderboard(Long challengeId) {
//        Challenge challenge = challengeRepository.findById(challengeId)
//                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("challengeId", challengeId);
//        result.put("challengeType", challenge.getChallengeType());
//
//        List<Map<String, Object>> leaderboard = new ArrayList<>();
//
//        if (challenge.getChallengeType() == ChallengeType.LEAST_SMOKED_WINS) {
//            List<Object[]> data = progressRepository.getLeaderboardByCigarettes(challengeId);
//            for (int i = 0; i < data.size(); i++) {
//                Object[] row = data.get(i);
//                Map<String, Object> entry = new HashMap<>();
//                entry.put("rank", i + 1);
//                entry.put("userId", row[0]);
//                entry.put("cigarettesSmoked", row[1] != null ? ((Number) row[1]).intValue() : 0);
//                entry.put("points", null);
//                leaderboard.add(entry);
//            }
//        } else {
//            List<Object[]> data = progressRepository.getLeaderboardByPoints(challengeId);
//            for (int i = 0; i < data.size(); i++) {
//                Object[] row = data.get(i);
//                Map<String, Object> entry = new HashMap<>();
//                entry.put("rank", i + 1);
//                entry.put("userId", row[0]);
//                entry.put("points", row[1] != null ? ((Number) row[1]).intValue() : 0);
//                entry.put("cigarettesSmoked", null);
//                leaderboard.add(entry);
//            }
//        }
//
//        result.put("leaderboard", leaderboard);
//        return result;
//    }

//    @Override
//    @Transactional(readOnly = true)
//    public Map<String, Object> getUserProgress(Long challengeId, String userId) {
//        Challenge challenge = challengeRepository.findById(challengeId)
//                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));
//
//        if (!isUserInChallenge(challengeId, userId)) {
//            throw new IllegalArgumentException("User is not participating in this challenge");
//        }
//
//        Map<String, Object> progress = new HashMap<>();
//        progress.put("challengeId", challengeId);
//        progress.put("userId", userId);
//
//        Optional<Integer> totalCigarettes = progressRepository.getTotalCigarettesSmokedByUser(challengeId, userId);
//        progress.put("totalCigarettesSmoked", totalCigarettes.orElse(0));
//
//        if (challenge.getChallengeType() == ChallengeType.DAILY_TARGET_POINTS) {
//            Optional<Integer> totalPoints = progressRepository.getTotalPointsByUser(challengeId, userId);
//            progress.put("totalPoints", totalPoints.orElse(0));
//        }
//
//        // Calculate current rank
//        Map<String, Object> leaderboardData = getLeaderboard(challengeId);
//        List<Map<String, Object>> leaderboard = (List<Map<String, Object>>) leaderboardData.get("leaderboard");
//
//        int rank = leaderboard.stream()
//                .filter(entry -> userId.equals(entry.get("userId")))
//                .map(entry -> (Integer) entry.get("rank"))
//                .findFirst()
//                .orElse(leaderboard.size() + 1);
//
//        progress.put("currentRank", rank);
//
//        return progress;
//    }
//
//    @Override
//    public void updateUserProgress(Long challengeId, String userId, LocalDate date, Integer cigarettesSmoked) {
//        Challenge challenge = challengeRepository.findById(challengeId)
//                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));
//
//        if (!isUserInChallenge(challengeId, userId)) {
//            return; // Silently skip if user is not in challenge
//        }
//
//        if (challenge.getStatus() != ChallengeStatus.ACTIVE) {
//            return; // Silently skip if challenge is not active
//        }
//
//        // Check if date is within challenge period
//        if (date.isBefore(challenge.getStartDate().toLocalDate()) ||
//            date.isAfter(challenge.getEndDate().toLocalDate())) {
//            return; // Silently skip if date is outside challenge period
//        }
//
//        Optional<ChallengeProgress> existingProgress =
//            progressRepository.findByChallengeIdAndUserIdAndDate(challengeId, userId, date);
//
//        ChallengeProgress progress;
//        if (existingProgress.isPresent()) {
//            progress = existingProgress.get();
//            progress.setCigarettesSmoked(cigarettesSmoked);
//        } else {
//            progress = new ChallengeProgress();
//            progress.setChallenge(challenge);
//            progress.setUserId(userId);
//            progress.setDate(date);
//            progress.setCigarettesSmoked(cigarettesSmoked);
//        }
//
//        // Calculate points for Daily Target Points challenges
//        if (challenge.getChallengeType() == ChallengeType.DAILY_TARGET_POINTS) {
//            ChallengeParticipant participant = participantRepository
//                .findByChallengeIdAndUserId(challengeId, userId)
//                .orElseThrow(() -> new IllegalStateException("Participant not found"));
//
//            Integer personalTarget = participant.getPersonalTarget();
//            if (personalTarget != null) {
//                int points = calculateDailyPoints(cigarettesSmoked, personalTarget);
//                progress.setPointsEarned(points);
//            }
//        }
//
//        progressRepository.save(progress);
//    }

    @Override
    public Map<String, Object> getLeaderboard(Long challengeId) {
        // Get challenge to verify it exists
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));

        // Get all progress records for this challenge
        List<ChallengeProgress> progressRecords = progressRepository.findByChallengeIdOrderByPointsEarnedDescCigarettesSmoked(challengeId);
        
        // Create leaderboard entries
        List<Map<String, Object>> leaderboard = new ArrayList<>();
        int rank = 1;
        for (ChallengeProgress progress : progressRecords) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("rank", rank++);
            entry.put("userId", progress.getUserId());
            entry.put("userName", progress.getUsername()); // Use username from progress record
            entry.put("cigarettesSmoked", progress.getCigarettesSmoked());
            entry.put("points", progress.getPointsEarned());
            leaderboard.add(entry);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("challengeId", challengeId);
        result.put("challengeTitle", challenge.getTitle());
        result.put("challengeType", challenge.getChallengeType());
        result.put("leaderboard", leaderboard);
        
        return result;
    }

    @Override
    public Map<String, Object> getUserProgress(Long challengeId, String userId) {
        // Get challenge to verify it exists
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));

        // Get user's progress for this challenge
        Optional<ChallengeProgress> progressOpt = progressRepository.findByChallengeIdAndUserId(challengeId, userId);
        
        if (progressOpt.isEmpty()) {
            return null;
        }

        ChallengeProgress progress = progressOpt.get();
        Map<String, Object> result = new HashMap<>();
        result.put("challengeId", challengeId);
        result.put("userId", userId);
        result.put("totalCigarettesSmoked", progress.getCigarettesSmoked());
        result.put("totalPoints", progress.getPointsEarned());
        result.put("currentRank", calculateUserRank(challengeId, userId));
        
        // Get personal target from participant record if it's a Daily Target Points challenge
        if (challenge.getChallengeType() == ChallengeType.DAILY_TARGET_POINTS) {
            Optional<ChallengeParticipant> participantOpt = participantRepository.findByChallengeIdAndUserId(challengeId, userId);
            if (participantOpt.isPresent()) {
                result.put("personalTarget", participantOpt.get().getPersonalTarget());
            }
        }
        
        return result;
    }

    @Override
    public void updateUserProgress(Long challengeId, String userId, LocalDate date, Integer cigarettesSmoked) {
        // Get challenge to verify it exists
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));

        // Get existing progress or create new one
        Optional<ChallengeProgress> existingProgress = progressRepository.findByChallengeIdAndUserIdAndDate(challengeId, userId, date);
        
        ChallengeProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.setCigarettesSmoked(cigarettesSmoked);
        } else {
            // Get username from UserService
            String username = null;
            try {
                username = userService.getUser(userId).username();
            } catch (Exception e) {
                // If we can't get username, use userId as fallback
                username = userId;
            }

            progress = ChallengeProgress.builder()
                    .challenge(challenge)
                    .userId(userId)
                    .username(username)
                    .date(date)
                    .cigarettesSmoked(cigarettesSmoked)
                    .pointsEarned(0)
                    .build();
        }
        
        // Calculate points for Daily Target Points challenges
        if (challenge.getChallengeType() == ChallengeType.DAILY_TARGET_POINTS) {
            Optional<ChallengeParticipant> participantOpt = participantRepository.findByChallengeIdAndUserId(challengeId, userId);
            if (participantOpt.isPresent() && participantOpt.get().getPersonalTarget() != null) {
                int points = calculateDailyPoints(cigarettesSmoked, participantOpt.get().getPersonalTarget());
                progress.setPointsEarned(points);
            }
        }
        
        progressRepository.save(progress);
    }

    // Private helper methods
    
    private void validateChallengeInputForCreation(String title, ChallengeType challengeType, Integer timeFrameDays) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Challenge title cannot be empty");
        }
        
        if (challengeType == null) {
            throw new IllegalArgumentException("Challenge type must be specified");
        }
        
        if (timeFrameDays == null || timeFrameDays < 1) {
            throw new IllegalArgumentException("Time frame must be at least 1 day");
        }
    }
    
    private void validateChallengeInput(String title, ChallengeType challengeType, 
                                      Integer timeFrameDays, LocalDateTime startDate) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Challenge title cannot be empty");
        }
        
        if (challengeType == null) {
            throw new IllegalArgumentException("Challenge type must be specified");
        }
        
        if (timeFrameDays == null || timeFrameDays < 1) {
            throw new IllegalArgumentException("Time frame must be at least 1 day");
        }
        
        if (startDate == null || startDate.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Start date must be in the future");
        }
    }
    
    private int calculateDailyPoints(int cigarettesSmoked, int personalTarget) {
        if (cigarettesSmoked <= personalTarget) {
            return personalTarget - cigarettesSmoked; // 1 point for each cigarette under target
        } else {
            return -2 * (cigarettesSmoked - personalTarget); // Lose 2 points for each cigarette over target
        }
    }
    
    private Integer calculateUserRank(Long challengeId, String userId) {
        List<ChallengeProgress> allProgress = progressRepository.findByChallengeIdOrderByPointsEarnedDescCigarettesSmoked(challengeId);
        
        for (int i = 0; i < allProgress.size(); i++) {
            if (allProgress.get(i).getUserId().equals(userId)) {
                return i + 1; // Rank starts from 1
            }
        }
        
        return null; // User not found in challenge
    }
}