package com.example.chat.services.interfaces;

import com.example.chat.models.ChatRoom;

public interface IChatRoomService {
    public ChatRoom getHistory(String username);
}
