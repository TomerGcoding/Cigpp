package com.bech.cigpp.model.challenge;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "challenge")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private ChallengeType challengeType;

    @Column(nullable = false)
    private Integer timeFrameDays;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Column(nullable = false)
    private String creatorUserId;

    @Enumerated(EnumType.STRING)
    private ChallengeStatus status = ChallengeStatus.UPCOMING;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL)
    private List<ChallengeParticipant> participants;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL)
    private List<ChallengeProgress> progressRecords;
}
