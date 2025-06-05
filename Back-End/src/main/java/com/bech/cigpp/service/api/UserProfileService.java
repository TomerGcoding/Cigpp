package com.bech.cigpp.service.api;

import com.bech.cigpp.controller.dto.log.CigaretteLogRequestDto;
import com.bech.cigpp.controller.dto.log.CigaretteLogResponseDto;
import com.bech.cigpp.controller.dto.user.UserProfileDto;

import java.time.Instant;
import java.util.List;

public interface UserProfileService {

    UserProfileDto addUserProfile(UserProfileDto dto);

    UserProfileDto getUserProfile(String userId);

    UserProfileDto updateUserProfile(String userId, UserProfileDto dto);

    void deleteUserProfile(String userId);

}
