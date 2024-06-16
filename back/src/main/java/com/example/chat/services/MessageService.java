package com.example.chat.services;

import com.example.chat.exceptions.SessionNotFoundException;
import com.example.chat.models.ChatMessage;
import com.example.chat.models.ChatSession;
import com.example.chat.repositories.ChatMessageRepository;
import com.example.chat.repositories.ChatSessionRepository;
import com.example.chat.services.interfaces.IMessageService;

public class MessageService implements IMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatSessionRepository chatSessionRepository;

    public MessageService(ChatMessageRepository chatMessageRepository, ChatSessionRepository chatSessionRepository){
        this.chatMessageRepository = chatMessageRepository;
        this.chatSessionRepository = chatSessionRepository;
    }

    public ChatMessage create(ChatMessage chatMessage, String sessionName){
        ChatSession session = chatSessionRepository.findByName(sessionName).orElseThrow(() -> new SessionNotFoundException("Target user cannot be found."));

    }
}
