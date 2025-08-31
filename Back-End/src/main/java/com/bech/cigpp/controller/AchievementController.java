package com.bech.cigpp.controller;

import com.bech.cigpp.service.api.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/achievements")
@RestController
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @PostMapping("/populate")
    public ResponseEntity<String> populateAchievements() {
        String result = achievementService.populateAchievementList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/attach/{userId}")
    public ResponseEntity<String> attachAchievementsToUser(@PathVariable String userId) {
        String result = achievementService.attachAchievementsToUser(userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/recalculate/{userId}")
    public ResponseEntity<Void> recalculateAchievements(@PathVariable String userId) {
        achievementService.recalculateAchievements(userId);
        return ResponseEntity.ok().build();
    }
}