package com.bech.cigpp.model.challenge;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_participant")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChallengeParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long participantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id")
    private Challenge challenge;

    @Column(nullable = false)
    private String userId;

    private LocalDateTime joinedAt = LocalDateTime.now();

    private Integer personalTarget; // For Daily Target Points challenges
}
