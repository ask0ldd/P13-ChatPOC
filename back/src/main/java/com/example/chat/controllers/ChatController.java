package com.example.chat.controllers;

import com.example.chat.dtos.payloads.MessageDto;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.User;
import com.example.chat.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.example.chat.models.ChatMessage;

import java.time.LocalDateTime;

@Controller
@Slf4j
public class ChatController {

    private final UserRepository userRepository;

    public ChatController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public") // linked to websocketconfig registry.enableSimpleBroker("/topic/", "/queue/")
    public ChatMessage sendMessage(@Payload MessageDto message) {
        System.out.println("message : " + message.getContent());
        User user = userRepository.findByName(message.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessage.builder()
                .type(message.getType())
                .content(message.getContent())
                .sender(user)
                .sentAt(LocalDateTime.now())
                .build();
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public") // linked to websocketconfig registry.enableSimpleBroker("/topic/", "/queue/")
    public ChatMessage addUser(@Payload MessageDto message, SimpMessageHeaderAccessor headerAccessor){
        // add username to websocket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        System.out.println("User connected : " + message.getSender());
        User user = userRepository.findByName(message.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessage.builder()
                .type(message.getType())
                .content(message.getSender() + " connected.")
                .sender(user)
                .sentAt(LocalDateTime.now())
                .build();
    }

    @MessageMapping("/chat/{roomId}/sendMessage")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessage sendMessage(@DestinationVariable String roomId, @Payload MessageDto message) {
        System.out.println("message : " + message.getContent());
        User user = userRepository.findByName(message.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessage.builder()
                .type(message.getType())
                .content(message.getContent())
                .sender(user)
                // .roomId(roomId)
                .sentAt(LocalDateTime.now())
                .build();
    }

    @MessageMapping("/chat/{roomId}/addUser")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessage addUser(@DestinationVariable String roomId, @Payload MessageDto message, SimpMessageHeaderAccessor headerAccessor) {
        // add username and roomId to websocket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        headerAccessor.getSessionAttributes().put("roomId", roomId);
        System.out.println("User connected : " + message.getSender() + " to room: " + roomId);
        User user = userRepository.findByName(message.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessage.builder()
                .type(message.getType())
                .content(message.getSender() + " connected.")
                .sender(user)
                // .roomId(roomId)
                .sentAt(LocalDateTime.now())
                .build();
    }
}