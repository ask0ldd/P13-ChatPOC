package com.example.chat.controllers;

import com.example.chat.dtos.payloads.MessageDto;
import com.example.chat.dtos.responses.ChatMessageResponseDto;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.User;
import com.example.chat.repositories.ChatMessageRepository;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.MessageService;
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
    private final MessageService messageService;

    public ChatController(MessageService messageService, UserRepository userRepository){
        this.userRepository = userRepository;
        this.messageService = messageService;
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
    @MessageMapping("/chat/sendMessage/{chatRoomId}")
    @SendTo("/queue/{chatRoomId}")
    public ChatMessageResponseDto sendMessage(@DestinationVariable String chatRoomId, @Payload MessageDto message) {
        System.out.println("message : " + message.getContent());
        ChatMessage chatMessage = messageService.saveMessage(chatRoomId, message);
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(message.getContent())
                .sender(chatMessage.getSender().getUsername())
                .chatroomId(chatRoomId)
                .sentAt(LocalDateTime.now())
                .build();
    }

    // private rooms
    @MessageMapping("/chat/addUser/{chatRoomId}")
    @SendTo("/queue/{chatRoomId}")
    public ChatMessageResponseDto addUser(@DestinationVariable String chatRoomId, @Payload MessageDto message, SimpMessageHeaderAccessor headerAccessor) {
        // add username and roomId to websocket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        headerAccessor.getSessionAttributes().put("roomId", chatRoomId);
        System.out.println("User connected : " + message.getSender() + " to room: " + chatRoomId);
        User user = userRepository.findByUsername(message.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(message.getSender() + " connected.")
                .sender(user.getUsername())
                .chatroomId(chatRoomId)
                .sentAt(LocalDateTime.now())
                .build();
    }
}