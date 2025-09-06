package com.bech.cigpp.service.api;

import com.bech.cigpp.controller.dto.achievement.UserAchievementResponseDto;

import java.util.List;

public interface AchievementService {

    String attachAchievementsToUser(String userId);

    void recalculateAchievements(String userId);

    String populateAchievementList();

    List<UserAchievementResponseDto> getUserAchievements(String userId);

}
