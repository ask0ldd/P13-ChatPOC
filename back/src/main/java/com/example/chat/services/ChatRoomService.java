package com.example.chat.services;

import com.example.chat.exceptions.SessionNotFoundException;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.ChatSession;
import com.example.chat.models.User;
import com.example.chat.repositories.ChatSessionRepository;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.interfaces.ISessionService;
import org.springframework.stereotype.Service;

@Service
public class SessionService implements ISessionService {

    private final UserRepository userRepository;
    private final ChatSessionRepository chatSessionRepository;

    public SessionService(UserRepository userRepository, ChatSessionRepository chatSessionRepository){
        this.userRepository = userRepository;
        this.chatSessionRepository = chatSessionRepository;
    }

    public ChatSession getSession(String username){
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return chatSessionRepository.findByUser(user).orElseThrow(() -> new SessionNotFoundException("Target session cannot be found."));
    }
}
