package com.example.chat.services.interfaces;

import com.example.chat.models.ChatSession;

public interface ISessionService {
    public ChatSession getSession(String username);
}
