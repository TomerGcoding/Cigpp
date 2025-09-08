package com.bech.cigpp.util;

import com.bech.cigpp.controller.dto.challenge.*;
import com.bech.cigpp.model.challenge.Challenge;
import com.bech.cigpp.model.challenge.ChallengeParticipant;
import com.bech.cigpp.model.challenge.ChallengeType;

import java.util.List;
import java.util.Map;

public class ChallengeMapper {

    public static ChallengeResponseDto toResponseDto(Challenge challenge, String currentUserId, 
                                                   Long participantCount, Map<String, Object> userProgress) {
        return new ChallengeResponseDto(
                challenge.getChallengeId(),
                challenge.getTitle(),
                challenge.getDescription(),
                challenge.getChallengeType(),
                mapChallengeTypeName(challenge.getChallengeType()),
                challenge.getTimeFrameDays(),
                mapTimeFrame(challenge.getTimeFrameDays()),
                challenge.getStartDate(),
                challenge.getEndDate(),
                challenge.getCreatorUserId(),
                challenge.getStatus(),
                participantCount,
                isUserInChallenge(challenge, currentUserId),
                userProgress != null ? mapToProgressDto(userProgress) : null
        );
    }

    public static List<ChallengeResponseDto> toResponseDtoList(List<Challenge> challenges, String currentUserId,
                                                             Map<Long, Long> participantCounts,
                                                             Map<Long, Map<String, Object>> userProgresses) {
        return challenges.stream()
                .map(challenge -> toResponseDto(
                        challenge, 
                        currentUserId, 
                        participantCounts.getOrDefault(challenge.getChallengeId(), 0L),
                        userProgresses.get(challenge.getChallengeId())
                ))
                .toList();
    }

    public static ChallengeProgressResponseDto mapToProgressDto(Map<String, Object> progressMap) {
        if (progressMap == null) {
            return null;
        }
        
        return new ChallengeProgressResponseDto(
                (Long) progressMap.get("challengeId"),
                (String) progressMap.get("userId"),
                (Integer) progressMap.get("totalCigarettesSmoked"),
                (Integer) progressMap.get("totalPoints"),
                (Integer) progressMap.get("currentRank"),
                (Integer) progressMap.get("personalTarget")
        );
    }

    public static LeaderboardResponseDto toLeaderboardDto(Long challengeId, String challengeTitle,
                                                        ChallengeType challengeType,
                                                        Map<String, Object> leaderboardData) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> leaderboard = (List<Map<String, Object>>) leaderboardData.get("leaderboard");
        
        List<LeaderboardEntryDto> entries = leaderboard.stream()
                .map(entry -> new LeaderboardEntryDto(
                        (Integer) entry.get("rank"),
                        (String) entry.get("userId"),
                        (String) entry.get("userName"), // Use username directly from progress data
                        (Integer) entry.get("cigarettesSmoked"),
                        (Integer) entry.get("points")
                ))
                .toList();

        return new LeaderboardResponseDto(
                challengeId,
                challengeTitle,
                challengeType,
                entries
        );
    }

    public static ChallengeStatisticsResponseDto toStatisticsDto(Map<String, Object> statisticsMap) {
        return new ChallengeStatisticsResponseDto(
                (Long) statisticsMap.get("challengeId"),
                (String) statisticsMap.get("title"),
                (com.bech.cigpp.model.challenge.ChallengeStatus) statisticsMap.get("status"),
                (Long) statisticsMap.get("participantCount"),
                (Long) statisticsMap.get("activeParticipants")
        );
    }

    // Private helper methods
    
    private static String mapChallengeTypeName(ChallengeType type) {
        return switch (type) {
            case LEAST_SMOKED_WINS -> "Least Smoked Wins";
            case DAILY_TARGET_POINTS -> "Daily Target Points";
        };
    }

    private static String mapTimeFrame(Integer days) {
        if (days == null) return "Unknown";
        
        return switch (days) {
            case 3 -> "3 Days";
            case 7 -> "1 Week";
            case 14 -> "2 Weeks";
            case 30 -> "1 Month";
            default -> days + " Days";
        };
    }

    private static Boolean isUserInChallenge(Challenge challenge, String userId) {
        if (challenge.getParticipants() == null || userId == null) {
            return false;
        }
        
        return challenge.getParticipants().stream()
                .anyMatch(participant -> userId.equals(participant.getUserId()));
    }

}