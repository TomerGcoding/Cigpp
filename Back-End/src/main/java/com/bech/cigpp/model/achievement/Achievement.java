package com.bech.cigpp.model.achievement;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "achievements")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long entryId;

    @Column(name = "achievement_id", nullable = false)
    private Long achievementId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "description", nullable = false)
    private String description;

    private Integer progress;

    private Integer target;

    private Boolean completed;

    private Instant startDate;

    private AchievementType achievementType;
}
