package com.example.chat.controllers;

import com.example.chat.services.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService){
        this.queueService = queueService;
    }

    @GetMapping("queue")
    public ResponseEntity<?> getUserList() {
        return ResponseEntity.ok().body(queueService.getUsers());
    }

    @PostMapping("queue/{userId}")
    public ResponseEntity<?> addUserToList(@PathVariable("userId") Long userId) {
        queueService.addUser(userId);
        return ResponseEntity.ok().build();
    }
}
