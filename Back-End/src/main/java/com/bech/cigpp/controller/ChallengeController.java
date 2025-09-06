package com.bech.cigpp.controller;

import com.bech.cigpp.controller.dto.challenge.*;
import com.bech.cigpp.model.challenge.Challenge;
import com.bech.cigpp.model.challenge.ChallengeStatus;
import com.bech.cigpp.service.api.ChallengeService;
import com.bech.cigpp.service.api.UserService;
import com.bech.cigpp.util.ChallengeMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;
    private final UserService userService;

    public ChallengeController(ChallengeService challengeService, UserService userService) {
        this.challengeService = challengeService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ChallengeResponseDto> createChallenge(
            @Valid @RequestBody CreateChallengeRequestDto request,
            @RequestHeader("User-ID") String userId) {
        
        Challenge challenge = challengeService.createChallenge(
                request.title(),
                request.description(),
                request.challengeType(),
                request.timeFrameDays(),
                request.startDate(),
                userId
        );

        Long participantCount = challengeService.getChallengeParticipantCount(challenge.getChallengeId());
        Map<String, Object> userProgress = challengeService.getUserProgress(challenge.getChallengeId(), userId);
        
        ChallengeResponseDto response = ChallengeMapper.toResponseDto(challenge, userId, participantCount, userProgress);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ChallengeResponseDto>> getAvailableChallenges(
            @RequestHeader("User-ID") String userId) {
        
        List<Challenge> challenges = challengeService.getAvailableChallenges(userId);
        
        Map<Long, Long> participantCounts = new HashMap<>();
        Map<Long, Map<String, Object>> userProgresses = new HashMap<>();
        
        for (Challenge challenge : challenges) {
            participantCounts.put(challenge.getChallengeId(), 
                challengeService.getChallengeParticipantCount(challenge.getChallengeId()));
        }
        
        List<ChallengeResponseDto> response = ChallengeMapper.toResponseDtoList(
                challenges, userId, participantCounts, userProgresses);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChallengeResponseDto> getChallengeById(
            @PathVariable Long id,
            @RequestHeader("User-ID") String userId) {
        
        Optional<Challenge> challengeOpt = challengeService.getChallengeById(id);
        if (challengeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Challenge challenge = challengeOpt.get();
        Long participantCount = challengeService.getChallengeParticipantCount(id);
        
        Map<String, Object> userProgress = null;
        if (challengeService.isUserInChallenge(id, userId)) {
            userProgress = challengeService.getUserProgress(id, userId);
        }
        
        ChallengeResponseDto response = ChallengeMapper.toResponseDto(challenge, userId, participantCount, userProgress);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChallengeResponseDto> updateChallenge(
            @PathVariable Long id,
            @Valid @RequestBody UpdateChallengeRequestDto request,
            @RequestHeader("User-ID") String userId) {
        
        Challenge updatedChallenge = challengeService.updateChallenge(id, request.title(), request.description(), userId);
        Long participantCount = challengeService.getChallengeParticipantCount(id);
        Map<String, Object> userProgress = challengeService.getUserProgress(id, userId);
        
        ChallengeResponseDto response = ChallengeMapper.toResponseDto(updatedChallenge, userId, participantCount, userProgress);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(
            @PathVariable Long id,
            @RequestHeader("User-ID") String userId) {
        
        challengeService.deleteChallenge(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> joinChallenge(
            @PathVariable Long id,
            @RequestBody(required = false) JoinChallengeRequestDto request,
            @RequestHeader("User-ID") String userId) {
        
        Integer personalTarget = request != null ? request.personalTarget() : null;
        challengeService.joinChallenge(id, userId, personalTarget);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<Void> leaveChallenge(
            @PathVariable Long id,
            @RequestHeader("User-ID") String userId) {
        
        challengeService.leaveChallenge(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<String>> getChallengeParticipants(@PathVariable Long id) {
        List<String> participants = challengeService.getChallengeParticipants(id);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/{id}/leaderboard")
    public ResponseEntity<LeaderboardResponseDto> getChallengeLeaderboard(@PathVariable Long id) {
        Optional<Challenge> challengeOpt = challengeService.getChallengeById(id);
        if (challengeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Challenge challenge = challengeOpt.get();
        Map<String, Object> leaderboardData = challengeService.getLeaderboard(id);
        
        LeaderboardResponseDto response = ChallengeMapper.toLeaderboardDto(
                id, challenge.getTitle(), challenge.getChallengeType(), leaderboardData, userService);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/active")
    public ResponseEntity<List<ChallengeResponseDto>> getUserActiveChallenges(
            @PathVariable String userId,
            @RequestHeader("User-ID") String currentUserId) {
        
        List<Challenge> challenges = challengeService.getUserChallenges(userId, ChallengeStatus.ACTIVE);
        
        Map<Long, Long> participantCounts = new HashMap<>();
        Map<Long, Map<String, Object>> userProgresses = new HashMap<>();
        
        for (Challenge challenge : challenges) {
            participantCounts.put(challenge.getChallengeId(), 
                challengeService.getChallengeParticipantCount(challenge.getChallengeId()));
            
            if (currentUserId.equals(userId)) {
                userProgresses.put(challenge.getChallengeId(),
                    challengeService.getUserProgress(challenge.getChallengeId(), userId));
            }
        }
        
        List<ChallengeResponseDto> response = ChallengeMapper.toResponseDtoList(
                challenges, currentUserId, participantCounts, userProgresses);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/completed")
    public ResponseEntity<List<ChallengeResponseDto>> getUserCompletedChallenges(
            @PathVariable String userId,
            @RequestHeader("User-ID") String currentUserId) {
        
        List<Challenge> challenges = challengeService.getUserChallenges(userId, ChallengeStatus.COMPLETED);
        
        Map<Long, Long> participantCounts = new HashMap<>();
        Map<Long, Map<String, Object>> userProgresses = new HashMap<>();
        
        for (Challenge challenge : challenges) {
            participantCounts.put(challenge.getChallengeId(), 
                challengeService.getChallengeParticipantCount(challenge.getChallengeId()));
            
            if (currentUserId.equals(userId)) {
                userProgresses.put(challenge.getChallengeId(),
                    challengeService.getUserProgress(challenge.getChallengeId(), userId));
            }
        }
        
        List<ChallengeResponseDto> response = ChallengeMapper.toResponseDtoList(
                challenges, currentUserId, participantCounts, userProgresses);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/created")
    public ResponseEntity<List<ChallengeResponseDto>> getUserCreatedChallenges(
            @PathVariable String userId,
            @RequestHeader("User-ID") String currentUserId) {
        
        List<Challenge> challenges = challengeService.getChallengesByCreator(userId);
        
        Map<Long, Long> participantCounts = new HashMap<>();
        Map<Long, Map<String, Object>> userProgresses = new HashMap<>();
        
        for (Challenge challenge : challenges) {
            participantCounts.put(challenge.getChallengeId(), 
                challengeService.getChallengeParticipantCount(challenge.getChallengeId()));
            
            if (currentUserId.equals(userId)) {
                userProgresses.put(challenge.getChallengeId(),
                    challengeService.getUserProgress(challenge.getChallengeId(), userId));
            }
        }
        
        List<ChallengeResponseDto> response = ChallengeMapper.toResponseDtoList(
                challenges, currentUserId, participantCounts, userProgresses);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/progress/{userId}")
    public ResponseEntity<ChallengeProgressResponseDto> getUserProgress(
            @PathVariable Long id,
            @PathVariable String userId) {
        
        Map<String, Object> progress = challengeService.getUserProgress(id, userId);
        ChallengeProgressResponseDto response = ChallengeMapper.mapToProgressDto(progress);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<ChallengeStatisticsResponseDto> getChallengeStatistics(@PathVariable Long id) {
        Map<String, Object> statistics = challengeService.getChallengeStatistics(id);
        ChallengeStatisticsResponseDto response = ChallengeMapper.toStatisticsDto(statistics);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/statistics")
    public ResponseEntity<Map<String, Object>> getUserChallengeStatistics(@PathVariable String userId) {
        Map<String, Object> statistics = challengeService.getUserChallengeStats(userId);
        return ResponseEntity.ok(statistics);
    }
}