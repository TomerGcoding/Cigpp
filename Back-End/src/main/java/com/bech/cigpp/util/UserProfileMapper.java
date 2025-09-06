package com.bech.cigpp.util;

import com.bech.cigpp.controller.dto.user.UserDto;
import com.bech.cigpp.model.user.User;

public class UserProfileMapper {

    public static UserDto toDto(User user) {
        return new UserDto(
                user.getUserId(),
                user.getUsername(),
                user.getDevice().getDeviceId(),
                user.getCurrentConsumption(),
                user.getTargetConsumption(),
                user.getTobacco(),
                user.getIsBlEnabled(),
                user.getIsNotificationsEnabled()
        );
    }

}
