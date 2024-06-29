package com.example.chat.websockets;

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

@Component
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;
    private final UserRepository userRepository;

    public WebSocketEventListener(SimpMessageSendingOperations messageTemplate, UserRepository userRepository) {
        this.messageTemplate = messageTemplate;
        this.userRepository = userRepository;
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        System.out.println("User disconnected : " + username);
        var message = ChatMessage.builder()
                .type(MessageType.LEAVE)
                .sender(user)
                .build();
        messageTemplate.convertAndSend("/topic/chat", message);
    }
}
