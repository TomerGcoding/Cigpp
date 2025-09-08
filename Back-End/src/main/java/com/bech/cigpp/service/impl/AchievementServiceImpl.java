package com.bech.cigpp.service.impl;

import com.bech.cigpp.controller.dto.achievement.AchievementDto;
import com.bech.cigpp.controller.dto.achievement.UserAchievementResponseDto;
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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

                case "Balanced Week":
                    progress = calculateConsecutiveDaysBelowTarget(userId);
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

                case "Master Achiever": // New achievement case
                    progress = calculateCompletedAchievements(userId);
                    // Check if all OTHER achievements are completed (6 out of 7 total, excluding Master Achiever itself)
                    if (progress >= 6) {
                        completed = true;
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

    private int calculateConsecutiveDaysBelowTarget(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getTargetConsumption() == null || user.getTargetConsumption() <= 0) {
            return 0; // No target set, can't calculate
        }
        int targetConsumption = user.getTargetConsumption();
        
        List<CigaretteLog> logs = cigaretteLogRepository.findByUserIdOrderByTimestampDesc(userId);
        if (logs.isEmpty()) {
            return 0;
        }

        ZoneId zone = ZoneId.systemDefault();

        LocalDate earliestLogDate = logs.get(logs.size() - 1).getTimestamp().atZone(zone).toLocalDate();

        // Group logs by date and count per day
        Map<LocalDate, Long> dailyCounts = logs.stream()
                .collect(Collectors.groupingBy(
                        log -> log.getTimestamp().atZone(zone).toLocalDate(),
                        Collectors.counting()
                ));

        LocalDate today = LocalDate.now(zone);
        LocalDate currentDay = today.minusDays(1); // מתחילים מאתמול (רק ימים שהושלמו)
        int consecutiveDays = 0;

        for (int i = 0; i < 7; i++) {
            if (currentDay.isBefore(earliestLogDate)) {
                break;
            }

            long cigs = dailyCounts.getOrDefault(currentDay, 0L);

            if (cigs <= targetConsumption) {
                consecutiveDays++;
                currentDay = currentDay.minusDays(1);
            } else {
                break;
            }
        }

        return consecutiveDays;
    }

    private boolean hasLightDay(String userId) {
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // Get start and end of yesterday
        Instant startOfYesterday = yesterday.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfYesterday = yesterday.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        // Count cigarettes smoked yesterday
        long yesterdayCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(
                userId, startOfYesterday, endOfYesterday
        );

        return yesterdayCount > 0 && yesterdayCount <= 5;
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
        ZoneId zone = ZoneId.systemDefault();
        LocalDate yesterday = LocalDate.now(zone).minusDays(1);

        // First, check if user has any cigarette logs at all
        List<CigaretteLog> userLogs = cigaretteLogRepository.findByUserId(userId);
        if (userLogs.isEmpty()) {
            return false; // No logs means no tracking history, so can't have a "clean day"
        }

        // Find the date of the first cigarette log
        LocalDate firstLogDate = userLogs.stream()
                .map(log -> log.getTimestamp().atZone(zone).toLocalDate())
                .min(LocalDate::compareTo)
                .orElse(null);

        // Yesterday must be after the first log date to be considered a valid "clean day"
        if (yesterday.isBefore(firstLogDate) || yesterday.equals(firstLogDate)) {
            return false;
        }

        // Now check if yesterday had zero cigarettes
        Instant start = yesterday.atStartOfDay(zone).toInstant();
        Instant end = yesterday.plusDays(1).atStartOfDay(zone).toInstant();

        long dailyCount = cigaretteLogRepository.countByUserIdAndTimestampBetween(userId, start, end);
        return dailyCount == 0;
    }

    private int calculateCompletedAchievements(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return 0;
        }

        List<UserAchievement> userAchievements = userAchievementRepository.findAllByUser(user);

        // Count completed achievements, excluding "Master Achiever" itself
        return (int) userAchievements.stream()
                .filter(ua -> ua.getIsCompleted() && !"Master Achiever".equals(ua.getAchievement().getName()))
                .count();
    }

    @Override
    public String populateAchievementList() {
        Achievement firstStep = Achievement.builder()
                .name("First Step")
                .description("Track your first cigarette - beginning your tracking journey")
                .iconName("flag-outline")
                .build();
        achievementRepository.save(firstStep);

        Achievement weeklyTracker = Achievement.builder()
                .name("Balanced Week")
                .description("7 consecutive days below your daily target")
                .iconName("calendar-outline")
                .build();
        achievementRepository.save(weeklyTracker);

        Achievement lightSmoker = Achievement.builder()
                .name("Light Day")
                .description("Have a day with 5 or fewer cigarettes")
                .iconName("cloud-outline")
                .build();
        achievementRepository.save(lightSmoker);

        Achievement monthlyMilestone = Achievement.builder()
                .name("Monthly Milestone")
                .description("Complete 30 days of tracking your smoking habits")
                .iconName("trophy-outline")
                .build();
        achievementRepository.save(monthlyMilestone);

        Achievement selfAware = Achievement.builder()
                .name("Self Aware")
                .description("Track 100 cigarettes - showing commitment to understanding your habits")
                .iconName("bulb-outline")
                .build();
        achievementRepository.save(selfAware);

        Achievement cleanDay = Achievement.builder()
                .name("Clean Day")
                .description("A full day without smoking")
                .iconName("leaf-outline")
                .build();
        achievementRepository.save(cleanDay);

        Achievement masterAchiever = Achievement.builder()
                .name("Master Achiever")
                .description("Complete all other achievements")
                .iconName("star-outline")
                .build();
        achievementRepository.save(masterAchiever);


        return "Successfully populated achievement list with 7 achievements";
    }

    @Override
    public List<UserAchievementResponseDto> getUserAchievements(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<UserAchievement> userAchievements = userAchievementRepository.findAllByUser(user);

        return userAchievements.stream()
                .map(ua -> new UserAchievementResponseDto(
                        ua.getId(),
                        new AchievementDto(
                                ua.getAchievement().getId(),
                                ua.getAchievement().getName(),
                                ua.getAchievement().getDescription(),
                                ua.getAchievement().getIconName()
                        ),
                        ua.getEarnedAt(),
                        ua.getProgress(),
                        ua.getIsCompleted()
                ))
                .collect(Collectors.toList());
    }}
