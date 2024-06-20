package com.example.chat.controllers;

import com.example.chat.services.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class AuthController {

    private final QueueService queueService;

    public AuthController(QueueService queueService){
        this.queueService = queueService;
    }

    @PostMapping("auth/{username}")
    public ResponseEntity<?> addUserToList(@PathVariable("username") String username) {
        queueService.addUser(username);
        return ResponseEntity.ok().build();
    }
}
