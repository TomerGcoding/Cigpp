package com.bech.cigpp.service.api;

import com.bech.cigpp.controller.dto.user.UserDto;

public interface UserService {

    UserDto addUser(UserDto dto);

    UserDto getUser(String userId);

    UserDto updateUser(String userId, UserDto dto);

    void deleteUser(String userId);

}
