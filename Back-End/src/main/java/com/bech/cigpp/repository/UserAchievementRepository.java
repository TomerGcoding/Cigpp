package com.bech.cigpp.repository;

import com.bech.cigpp.model.achievement.Achievement;
import com.bech.cigpp.model.achievement.UserAchievement;
import com.bech.cigpp.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement,Long> {

    UserAchievement findByUserAndAchievement(User user, Achievement achievement);

    List<UserAchievement> findAllByUser(User user);
}
