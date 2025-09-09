package com.bech.cigpp.controller;


import com.bech.cigpp.controller.dto.user.UserDto;
import com.bech.cigpp.service.api.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/user")
@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDto> addUserProfile(@RequestBody UserDto dto) {
        UserDto response = userService.addUser(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ping") String checkServerHealth() {
        return "Server is running!";
    }
}
