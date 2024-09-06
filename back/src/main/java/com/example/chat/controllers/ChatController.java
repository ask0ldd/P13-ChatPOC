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

    /**
     * Adds a user to a public chat room.
     *
     * @param message The message containing user information.
     * @param headerAccessor The header accessor for the message.
     * @return A ChatMessageResponseDto indicating the user has connected.
     * @throws UserNotFoundException If the user cannot be found in the repository.
     */
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

    /**
     * Sends a message to a private chat room.
     *
     * @param chatroomName The name of the private chat room.
     * @param message The message details.
     * @return A ChatMessageResponseDto containing the sent message information.
     */
    @MessageMapping("/chat/sendMessage/{chatroomName}")
    @SendTo("/queue/{chatroomName}")
    public ChatMessageResponseDto sendPrivateMessage(@DestinationVariable String chatroomName, @Payload MessageDto message) {
        System.out.println("message : " + message.getContent());
        ChatMessage chatMessage = messageService.saveMessage(chatroomName, message);
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(message.getContent())
                .sender(message.getSender())
                .chatroomName(chatroomName)
                .sentAt(LocalDateTime.now())
                .build();
    }

    /**
     * Adds a user to a private chat room.
     *
     * @param chatroomName The name of the private chat room.
     * @param message The message containing user information.
     * @param headerAccessor The header accessor for the message.
     * @return A ChatMessageResponseDto indicating the user has connected to the private room.
     * @throws UserNotFoundException If the user cannot be found in the repository.
     */
    @MessageMapping("/chat/addUser/{chatroomName}") // entering
    @SendTo("/queue/{chatroomName}") // dispatched to
    public ChatMessageResponseDto addPrivateUser(@DestinationVariable String chatroomName, @Payload MessageDto message, SimpMessageHeaderAccessor headerAccessor) {
        // add username and roomId to the websocket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        headerAccessor.getSessionAttributes().put("roomId", chatroomName);
        String sender = message.getSender();
        User user = userRepository.findByUsername(sender).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        System.out.println("User connected : " + sender + " to room: " + chatroomName);
        return ChatMessageResponseDto.builder()
                .type(message.getType())
                .content(sender + " connected.")
                .sender(sender)
                .chatroomName(chatroomName)
                .sentAt(LocalDateTime.now())
                .build();
    }

    /**
     * Retrieves the chat history for a specific chat room.
     *
     * @param chatroomName The name of the chat room.
     * @return A ChatRoomHistoryResponseDto containing the chat room history.
     */
    @GetMapping("/api/history/{chatroomName}")
    @ResponseBody
    public ChatRoomHistoryResponseDto getHistory(@PathVariable final String chatroomName){
        ChatRoomHistory chatroomHistory = chatRoomHistoryService.getHistory(chatroomName);
        return new ChatRoomHistoryResponseDto(chatroomHistory);
    }
}