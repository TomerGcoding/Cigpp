package com.bech.cigpp.model.challenge;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "challenge_progress")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChallengeProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id")
    private Challenge challenge;

    @Column(nullable = false)
    private String userId;

    @Column
    private String username;

    @Column(nullable = false)
    private LocalDate date;

    private Integer cigarettesSmoked = 0;

    private Integer pointsEarned = 0;
}
