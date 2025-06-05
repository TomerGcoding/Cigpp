package com.bech.cigpp.controller;


import com.bech.cigpp.controller.dto.user.UserProfileDto;
import com.bech.cigpp.service.api.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/user")
@RestController
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    public ResponseEntity<UserProfileDto> addUserProfile(UserProfileDto dto) {
        UserProfileDto response = userProfileService.addUserProfile(dto);
        return ResponseEntity.ok(response);
    }
}
