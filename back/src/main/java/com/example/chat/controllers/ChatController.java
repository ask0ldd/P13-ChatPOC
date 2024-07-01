package com.example.chat.controllers;

import com.example.chat.dtos.payloads.MessageDto;
import com.example.chat.dtos.responses.ChatMessageResponseDto;
import com.example.chat.dtos.responses.ChatRoomHistoryResponseDto;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.ChatMessage;
import com.example.chat.models.ChatRoomHistory;
import com.example.chat.models.User;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.ChatRoomHistoryService;
import com.example.chat.services.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

    private final UserRepository userRepository;
    private final MessageService messageService;
    private final ChatRoomHistoryService chatRoomHistoryService;

    public ChatController(MessageService messageService, UserRepository userRepository, ChatRoomHistoryService chatRoomHistoryService){
        this.userRepository = userRepository;
        this.messageService = messageService;
        this.chatRoomHistoryService = chatRoomHistoryService;
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
    public ChatMessageResponseDto sendPublicMessage(@Payload MessageDto message) {
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
    public ChatMessageResponseDto addPublicUser(@Payload MessageDto message, SimpMessageHeaderAccessor headerAccessor){
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
    public ChatMessageResponseDto sendPrivateMessage(@DestinationVariable String chatRoomId, @Payload MessageDto message) {
        System.out.println("message : " + message.getContent());
        ChatMessage chatMessage = messageService.saveMessage(chatRoomId, message);
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(message.getContent())
                .sender(message.getSender())
                .chatroomId(chatRoomId)
                .sentAt(LocalDateTime.now())
                .build();
    }

    // private rooms
    @MessageMapping("/chat/addUser/{chatRoomId}") // entering
    @SendTo("/queue/{chatRoomId}") // dispatched to
    public ChatMessageResponseDto addPrivateUser(@DestinationVariable String chatRoomId, @Payload MessageDto message, SimpMessageHeaderAccessor headerAccessor) {
        // add username and roomId to websocket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        headerAccessor.getSessionAttributes().put("roomId", chatRoomId);
        String sender = message.getSender();
        System.out.println("User connected : " + sender + " to room: " + chatRoomId);
        // User user = userRepository.findByUsername(sender).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(sender + " connected.")
                .sender(sender)
                .chatroomId(chatRoomId)
                .sentAt(LocalDateTime.now())
                .build();
    }

    @GetMapping("/api/history/{chatroomId}")
    @ResponseBody
    public ChatRoomHistoryResponseDto getHistory(@PathVariable final String chatroomId){
        ChatRoomHistory chatroomHistory = chatRoomHistoryService.getHistory(chatroomId);
        return new ChatRoomHistoryResponseDto(chatroomHistory);
    }
}