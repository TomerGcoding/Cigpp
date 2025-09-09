package com.bech.cigpp.model.user;


import com.bech.cigpp.model.device.Device;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_profile")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    private String userId;

    private String username;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "device_id")
    private Device device;

    private Integer currentConsumption;

    private Integer targetConsumption;

    private String tobacco;

    private Boolean isBlEnabled;

    private Boolean isNotificationsEnabled;
}
