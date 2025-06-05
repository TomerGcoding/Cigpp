package com.bech.cigpp.controller.dto.user;


public record UserProfileDto(
        String userId,
        String username,
        String deviceId,
        Integer currentConsumption,
        Integer targetConsumption,
        String tobacco,
        Boolean isBlEnabled,
        Boolean isNotificationsEnabled
) {
}
