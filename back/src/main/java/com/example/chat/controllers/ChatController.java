package com.example.chat.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.example.chat.models.ChatMessage;

@Controller
public class ChatController {

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages") // linked to websocketconfig registry.enableSimpleBroker("/topic/", "/queue/")
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        return message;
    }

    @MessageMapping("/addUser")
    @SendTo("/topic/messages") // linked to websocketconfig registry.enableSimpleBroker("/topic/", "/queue/")
    public ChatMessage addUser(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor){
        // add username to websocket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }
}