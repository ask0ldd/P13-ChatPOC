package com.example.chat.controllers;

import com.example.chat.dtos.responses.UserResponseDto;
import com.example.chat.models.User;
import com.example.chat.services.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService){
        this.queueService = queueService;
    }

    @GetMapping("queue")
    public ResponseEntity<List<UserResponseDto>> getUserList() {
        List<UserResponseDto> queue = queueService.getUsers().stream().map(UserResponseDto::new).toList();
        return ResponseEntity.ok().body(queue);
    }

    @PostMapping("queue/remove")
    public ResponseEntity<List<UserResponseDto>> removeUserFromQueue(String username) {
        queueService.removeUser(username);
        List<UserResponseDto> queue = queueService.getUsers().stream().map(UserResponseDto::new).toList();
        return ResponseEntity.ok().body(queue);
    }
}
