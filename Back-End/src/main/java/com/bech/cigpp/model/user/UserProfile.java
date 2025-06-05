package com.bech.cigpp.model.user;


import com.bech.cigpp.model.device.Device;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "user_profile")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfile {

    @Id
    private String userId;

    private String username;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private Device device;

    private Integer currentConsumption;

    private Integer targetConsumption;

    private String tobacco;

    private Boolean isBlEnabled;

    private Boolean isNotificationsEnabled;
}
