package com.bech.cigpp.model.log;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "cigarette_log")
@Data
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
