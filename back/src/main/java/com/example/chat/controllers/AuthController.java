package com.example.chat.controllers;

import com.example.chat.dtos.payloads.DisconnectRequestDto;
import com.example.chat.dtos.payloads.LoginRequestDto;
import com.example.chat.dtos.responses.UserResponseDto;
import com.example.chat.models.User;
import com.example.chat.services.QueueService;
import com.example.chat.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class AuthController {

    private final QueueService queueService;
    private final UserService userService;

    public AuthController(QueueService queueService, UserService userService){
        this.queueService = queueService;
        this.userService = userService;
    }

    @PostMapping("auth/login")
    public ResponseEntity<UserResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        User user = userService.getUser(loginRequest.getUsername());
        if(user.getRole().equals("CUSTOMER")) queueService.addUser(user);
        return ResponseEntity.ok().body(new UserResponseDto(user));
    }

    @PostMapping("auth/disconnect")
    public ResponseEntity<?> disconnect(@RequestBody DisconnectRequestDto disconnectRequest) {
        User user = userService.getUser(disconnectRequest.getUsername());
        queueService.removeUser(user);
        return ResponseEntity.ok().build();
    }
}
