package com.bech.cigpp.service.impl;

import com.bech.cigpp.controller.dto.user.UserDto;
import com.bech.cigpp.model.device.Device;
import com.bech.cigpp.model.user.User;
import com.bech.cigpp.repository.DeviceRepository;
import com.bech.cigpp.service.api.UserService;
import com.bech.cigpp.repository.UserRepository;
import com.bech.cigpp.util.UserProfileMapper;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;

    public UserServiceImpl(UserRepository userRepository, DeviceRepository deviceRepository) {
        this.userRepository = userRepository;
        this.deviceRepository = deviceRepository;
    }

    @Override
    public UserDto addUser(UserDto dto) {
        Device device = deviceRepository.findById(dto.deviceId())
                .orElseThrow(() -> new IllegalArgumentException("Device ID not found: " + dto.deviceId()));
        if(device.getUser()!= null){
            throw new IllegalStateException("Device already has an associated user");
        }
        User newUser= User.builder()
                .userId(dto.userId())
                .currentConsumption(dto.currentConsumption())
                .targetConsumption(dto.targetConsumption())
                .tobacco(dto.tobacco())
                .isBlEnabled(dto.isBlEnabled())
                .isNotificationsEnabled(dto.isNotificationsEnabled())
                .username(dto.username())
                .device(device)
                .build();

        User savedUser = userRepository.save(newUser);

        if (savedUser == null) {
            throw new RuntimeException("Failed to save user profile");
        }

//        device.setUser(savedUserProfile);
//        deviceRepository.save(device);

        return UserProfileMapper.toDto(savedUser);

    }

    @Override
    public UserDto getUser(String userId) {
        // Logic to get user profile by userId
        return null; // Replace with actual implementation
    }

    @Override
    public UserDto updateUser(String userId, UserDto dto) {
        // Logic to update user profile by userId
        return null; // Replace with actual implementation
    }

    @Override
    public void deleteUser(String userId) {
        // Logic to delete user profile by userId
    }
}
