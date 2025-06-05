package com.bech.cigpp.service.impl;

import com.bech.cigpp.controller.dto.user.UserProfileDto;
import com.bech.cigpp.model.device.Device;
import com.bech.cigpp.model.user.UserProfile;
import com.bech.cigpp.repository.DeviceRepository;
import com.bech.cigpp.service.api.UserProfileService;
import com.bech.cigpp.repository.UserProfileRepository;
import com.bech.cigpp.util.UserProfileMapper;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final DeviceRepository deviceRepository;

    public UserProfileServiceImpl(UserProfileRepository userProfileRepository, DeviceRepository deviceRepository) {
        this.userProfileRepository = userProfileRepository;
        this.deviceRepository = deviceRepository;
    }

    @Override
    public UserProfileDto addUserProfile(UserProfileDto dto) {
        Device device = deviceRepository.findById(dto.deviceId())
                .orElseThrow(() -> new IllegalArgumentException("Device ID not found: " + dto.deviceId()));
        if(device.getUser()!= null){
            throw new IllegalStateException("Device already has an associated user");
        }
        UserProfile newUser= UserProfile.builder()
                .userId(dto.userId())
                .currentConsumption(dto.currentConsumption())
                .targetConsumption(dto.targetConsumption())
                .tobacco(dto.tobacco())
                .isBlEnabled(dto.isBlEnabled())
                .isNotificationsEnabled(dto.isNotificationsEnabled())
                .username(dto.username())
                .device(device)
                .build();

        UserProfile savedUserProfile = userProfileRepository.save(newUser);

        if (savedUserProfile == null) {
            throw new RuntimeException("Failed to save user profile");
        }

        device.setUser(savedUserProfile);
        deviceRepository.save(device);

        return UserProfileMapper.toDto(savedUserProfile);

    }

    @Override
    public UserProfileDto getUserProfile(String userId) {
        // Logic to get user profile by userId
        return null; // Replace with actual implementation
    }

    @Override
    public UserProfileDto updateUserProfile(String userId, UserProfileDto dto) {
        // Logic to update user profile by userId
        return null; // Replace with actual implementation
    }

    @Override
    public void deleteUserProfile(String userId) {
        // Logic to delete user profile by userId
    }
}
