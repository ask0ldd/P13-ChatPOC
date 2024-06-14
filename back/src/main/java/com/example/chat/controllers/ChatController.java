package com.example.chat.controllers;

import com.example.chat.dtos.payloads.MessageDto;
import lombok.extern.slf4j.Slf4j;
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

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public") // linked to websocketconfig registry.enableSimpleBroker("/topic/", "/queue/")
    public ChatMessage sendMessage(@Payload MessageDto message) {
        System.out.println("message : " + message.getContent());
        return ChatMessage.builder()
                .type(message.getType())
                .content(message.getContent())
                .sender(message.getSender())
                .sentAt(LocalDateTime.now())
                .build();
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public") // linked to websocketconfig registry.enableSimpleBroker("/topic/", "/queue/")
    public ChatMessage addUser(@Payload MessageDto message, SimpMessageHeaderAccessor headerAccessor){
        // add username to websocket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        System.out.println("User connected : " + message.getSender());
        return ChatMessage.builder()
                .type(message.getType())
                .content(message.getSender() + " connected.")
                .sender(message.getSender())
                .sentAt(LocalDateTime.now())
                .build();
    }
}