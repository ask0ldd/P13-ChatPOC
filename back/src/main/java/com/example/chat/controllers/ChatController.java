package com.example.chat.controllers;

import com.example.chat.dtos.payloads.MessageDto;
import com.example.chat.dtos.responses.ChatMessageResponseDto;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.User;
import com.example.chat.repositories.UserRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.example.chat.models.ChatMessage;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@Controller
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

    private final UserRepository userRepository;

    public ChatController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    /**
     * Sends a message to a public room
     *
     * @param message The {@link MessageDto} object containing the message details.
     * @return A {@link ChatMessage} object representing the sent message.
     * @throws UserNotFoundException If the sender user cannot be found in the repository.
     */
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public") // linked to websocketconfig registry.enableSimpleBroker("/topic/", "/queue/")
    public ChatMessageResponseDto sendMessage(@Payload MessageDto message) {
        System.out.println("message : " + message.getContent());
        User user = userRepository.findByUsername(message.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(message.getContent())
                .sender(user.getUsername())
                .sentAt(LocalDateTime.now())
                .build();
    }

    // public room
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public") // linked to websocketconfig registry.enableSimpleBroker("/topic/", "/queue/")
    public ChatMessageResponseDto addUser(@Payload MessageDto message, SimpMessageHeaderAccessor headerAccessor){
        // add username to websocket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        System.out.println("User connected : " + message.getSender());
        User user = userRepository.findByUsername(message.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(message.getSender() + " connected.")
                .sender(user.getUsername())
                .sentAt(LocalDateTime.now())
                .build();
    }

    // private rooms
    @MessageMapping("/chat/sendMessage/{roomId}")
    @SendTo("/queue/{roomId}")
    public ChatMessageResponseDto sendMessage(@DestinationVariable String roomId, @Payload MessageDto message) {
        System.out.println("message : " + message.getContent());
        User user = userRepository.findByUsername(message.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(message.getContent())
                .sender(user.getUsername())
                .sentAt(LocalDateTime.now())
                .build();
    }

    // private rooms
    @MessageMapping("/chat/addUser/{roomId}")
    @SendTo("/queue/{roomId}")
    public ChatMessageResponseDto addUser(@DestinationVariable String roomId, @Payload MessageDto message, SimpMessageHeaderAccessor headerAccessor) {
        // add username and roomId to websocket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        headerAccessor.getSessionAttributes().put("roomId", roomId);
        System.out.println("User connected : " + message.getSender() + " to room: " + roomId);
        User user = userRepository.findByUsername(message.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(message.getSender() + " connected.")
                .sender(user.getUsername())
                .sentAt(LocalDateTime.now())
                .build();
    }
}