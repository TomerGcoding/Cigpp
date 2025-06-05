package com.bech.cigpp.model.device;


import com.bech.cigpp.model.user.UserProfile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "devices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {

    @Id
    private String deviceId;

    @OneToOne(mappedBy = "device", fetch = FetchType.LAZY)
    private UserProfile user;

}
