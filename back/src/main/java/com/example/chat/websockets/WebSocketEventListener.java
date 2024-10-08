package com.example.chat.websockets;

import com.example.chat.dtos.responses.ChatMessageResponseDto;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.ChatMessage;
import com.example.chat.models.MessageType;
import com.example.chat.models.User;
import com.example.chat.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;

@Component
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;
    private final UserRepository userRepository;

    public WebSocketEventListener(SimpMessageSendingOperations messageTemplate, UserRepository userRepository) {
        this.messageTemplate = messageTemplate;
        this.userRepository = userRepository;
    }

    /**
     * Handles the disconnection event of a user from a chat session.
     *
     * @param event The SessionDisconnectEvent containing information about the disconnected session.
     * @throws UserNotFoundException if the disconnected user cannot be found in the repository.
     */
    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomname = (String) headerAccessor.getSessionAttributes().get("roomname");
        System.out.println("User disconnected : " + username);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        var message = ChatMessageResponseDto.builder()
                .type(MessageType.LEAVE)
                .content(username + " leaved.")
                .sender(username)
                .chatroomName(roomname)
                .sentAt(LocalDateTime.now())
                .build();
        messageTemplate.convertAndSend("/queue/" + roomname, message);
    }
}
