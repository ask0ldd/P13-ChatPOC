package com.example.chat.services.interfaces;

import com.example.chat.models.ChatRoomHistory;

public interface IChatRoomService {
    public ChatRoomHistory getHistory(String chatroomId);
}
