package com.bech.cigpp.model.log;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "cigarette_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CigaretteLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    private String description;

    private Instant timestamp;

}
