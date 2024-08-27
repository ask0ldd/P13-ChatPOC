package com.example.chat.controllers;

import com.example.chat.dtos.payloads.LoginRequestDto;
import com.example.chat.dtos.payloads.RemoveUserFromQueueRequestDto;
import com.example.chat.dtos.projections.UserProjectionDto;
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

    /**
     * Retrieves the list of users in the queue.
     * @return ResponseEntity containing a list of UserResponseDto objects representing the users in the queue
     */
    @GetMapping("queue")
    public ResponseEntity<List<UserResponseDto>> getUserList() {
        List<UserResponseDto> queue = queueService.getUsers().stream().map(UserResponseDto::new).toList();
        return ResponseEntity.ok().body(queue);
    }

    /**
     * Removes a user from the queue.
     * @param removeRequest a RemoveUserFromQueueRequestDto containing the username of the user to be removed
     * @return ResponseEntity containing a list of UserResponseDto objects representing the updated queue after removal
     */
    @PostMapping("queue/remove")
    public ResponseEntity<List<UserResponseDto>> removeUserFromQueue(@RequestBody RemoveUserFromQueueRequestDto removeRequest) {
        Set<UserProjectionDto> queue = queueService.removeUser(removeRequest.getUsername());
        List<UserResponseDto> queueDto = queue.stream().map(UserResponseDto::new).toList();
        return ResponseEntity.ok().body(queueDto);
    }
}
