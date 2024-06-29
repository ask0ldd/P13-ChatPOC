package com.example.chat.controllers;

import com.example.chat.dtos.payloads.LoginRequestDto;
import com.example.chat.dtos.payloads.RemoveUserFromQueueRequestDto;
import com.example.chat.dtos.responses.UserResponseDto;
import com.example.chat.models.User;
import com.example.chat.services.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

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
    public ResponseEntity<List<UserResponseDto>> removeUserFromQueue(@RequestBody RemoveUserFromQueueRequestDto removeRequest) {
        Set<User> queue = queueService.removeUser(removeRequest.getUsername());
        List<UserResponseDto> queueDto = queue.stream().map(UserResponseDto::new).toList();
        return ResponseEntity.ok().body(queueDto);
    }
}
