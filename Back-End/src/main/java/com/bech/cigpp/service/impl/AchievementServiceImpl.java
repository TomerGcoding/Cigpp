package com.bech.cigpp.service.impl;

import com.bech.cigpp.model.achievement.Achievement;
import com.bech.cigpp.model.achievement.UserAchievement;
import com.bech.cigpp.model.log.CigaretteLog;
import com.bech.cigpp.model.user.User;
import com.bech.cigpp.repository.AchievementRepository;
import com.bech.cigpp.repository.CigaretteLogRepository;
import com.bech.cigpp.repository.UserAchievementRepository;
import com.bech.cigpp.repository.UserRepository;
import com.bech.cigpp.service.api.AchievementService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final UserRepository userRepository;
    private final CigaretteLogRepository cigaretteLogRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public AchievementServiceImpl(UserRepository userRepository, CigaretteLogRepository cigaretteLogRepository, AchievementRepository achievementRepository, UserAchievementRepository userAchievementRepository) {
        this.userRepository = userRepository;
        this.cigaretteLogRepository = cigaretteLogRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }


    @Override
    public String attachAchievementsToUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Achievement> achievements = achievementRepository.findAll();
        for (Achievement achievement : achievements) {
            UserAchievement userAchievement = UserAchievement.builder()
                    .achievement(achievement)
                    .user(user)
                    .earnedAt(null)
                    .isCompleted(false)
                    .progress(0).build();
            userAchievementRepository.save(userAchievement);
        }
        return "Successfully attached achievements";
    }

    @Override
    public void recalculateAchievements(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<UserAchievement> userAchievements = userAchievementRepository.findAllByUser(user);

        for (UserAchievement userAchievement : userAchievements) {
            if (userAchievement.getIsCompleted()) {
                continue;
            }

            String achievementName = userAchievement.getAchievement().getName();
            boolean completed = false;
            int progress = 0;

            switch (achievementName) {
                case "First Step":
                    long totalLogs = cigaretteLogRepository.findByUserId(userId).size();
                    if (totalLogs >= 1) {
                        completed = true;
                        progress = 1;
                    }
                    break;

                case "Weekly Warrior":
                    progress = calculateConsecutiveTrackingDays(userId);
                    if (progress >= 7) {
                        completed = true;
                    }
                    break;

                case "Light Day":
                    if (hasLightDay(userId)) {
                        completed = true;
                        progress = 1;
                    }
                    break;

                case "Monthly Milestone":
                    progress = calculateTotalTrackingDays(userId);
                    if (progress >= 30) {
                        completed = true;
                    }
                    break;

                case "Self Aware":
                    progress = Math.min(100, cigaretteLogRepository.countByUserId(userId));
                    if (progress >= 100) {
                        completed = true;
                    }
                    break;

                case "Clean Day":
                    if (hasCleanDay(userId)) {
                        completed = true;
                        progress = 1;
                    }
                    break;
            }

            userAchievement.setProgress(progress);
            if (completed && !userAchievement.getIsCompleted()) {
                userAchievement.setIsCompleted(true);
                userAchievement.setEarnedAt(LocalDateTime.now());
            }

            userAchievementRepository.save(userAchievement);
        }
    }

    private int calculateConsecutiveTrackingDays(String userId) {
        List<CigaretteLog> logs = cigaretteLogRepository.findByUserIdOrderByTimestampDesc(userId);
        if (logs.isEmpty()) {
            return 0;
        }

        LocalDate today = LocalDate.now();
        LocalDate currentDay = today;
        int consecutiveDays = 0;

        for (CigaretteLog log : logs) {
            LocalDate logDate = log.getTimestamp().atZone(ZoneId.systemDefault()).toLocalDate();

            if (logDate.equals(currentDay)) {
                consecutiveDays++;
                currentDay = currentDay.minusDays(1);
            } else if (logDate.isBefore(currentDay)) {
                break;
            }
        }

        return consecutiveDays;
    }

    private boolean hasLightDay(String userId) {
        LocalDate today = LocalDate.now();
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        long dailyCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, startOfDay, endOfDay);
        if (dailyCount <= 5) {
            return true;
        }
        return false;
    }

    private int calculateTotalTrackingDays(String userId) {
        List<CigaretteLog> logs = cigaretteLogRepository.findByUserId(userId);
        if (logs.isEmpty()) {
            return 0;
        }

        return (int) logs.stream()
                .map(log -> log.getTimestamp().atZone(ZoneId.systemDefault()).toLocalDate())
                .distinct()
                .count();
    }

    private boolean hasCleanDay(String userId) {
        LocalDate today = LocalDate.now();
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        long dailyCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, startOfDay, endOfDay);
        if (dailyCount == 0) {
            return true;
        }
        return false;
    }

    @Override
    public String populateAchievementList() {
        Achievement firstStep = Achievement.builder()
                .name("First Step")
                .description("Log your first cigarette - beginning your tracking journey")
                .iconName("first_step")
                .build();
        achievementRepository.save(firstStep);

        Achievement weeklyTracker = Achievement.builder()
                .name("Weekly Warrior")
                .description("Track your cigarettes for 7 consecutive days")
                .iconName("calendar_week")
                .build();
        achievementRepository.save(weeklyTracker);

        Achievement lightSmoker = Achievement.builder()
                .name("Light Day")
                .description("Have a day with 5 or fewer cigarettes")
                .iconName("light_smoke")
                .build();
        achievementRepository.save(lightSmoker);

        Achievement monthlyMilestone = Achievement.builder()
                .name("Monthly Milestone")
                .description("Complete 30 days of tracking your smoking habits")
                .iconName("trophy")
                .build();
        achievementRepository.save(monthlyMilestone);

        Achievement selfAware = Achievement.builder()
                .name("Self Aware")
                .description("Log 100 cigarettes - showing commitment to understanding your habits")
                .iconName("awareness")
                .build();
        achievementRepository.save(selfAware);

        Achievement cleanDay = Achievement.builder()
                .name("Clean Day")
                .description("A full day without smoking")
                .iconName("cleanDay")
                .build();
        achievementRepository.save(cleanDay);

        return "Successfully populated achievement list with 6 achievements";
    }
}
