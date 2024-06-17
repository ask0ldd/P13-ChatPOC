package com.example.chat.services.interfaces;

import com.example.chat.exceptions.SessionNotFoundException;
import com.example.chat.models.ChatMessage;
import com.example.chat.models.ChatSession;

public interface IMessageService {
    public ChatMessage saveMessage(ChatMessage chatMessage, String sessionName);
}
