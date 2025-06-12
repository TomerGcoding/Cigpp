package com.bech.cigpp.util;

import com.bech.cigpp.controller.dto.user.UserProfileDto;
import com.bech.cigpp.model.user.UserProfile;

public class UserProfileMapper {

    public static UserProfileDto toDto(UserProfile userProfile) {
        return new UserProfileDto(
                userProfile.getUserId(),
                userProfile.getUsername(),
                userProfile.getDevice().getDeviceId(),
                userProfile.getCurrentConsumption(),
                userProfile.getTargetConsumption(),
                userProfile.getTobacco(),
                userProfile.getIsBlEnabled(),
                userProfile.getIsNotificationsEnabled()
        );
    }

}
