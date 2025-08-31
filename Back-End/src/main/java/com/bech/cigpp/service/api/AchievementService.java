package com.bech.cigpp.service.api;

public interface AchievementService {

    String attachAchievementsToUser(String userId);

    void recalculateAchievements(String userId);

    String populateAchievementList();

}
