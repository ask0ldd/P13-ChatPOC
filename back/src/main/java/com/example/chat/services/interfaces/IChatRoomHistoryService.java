package com.example.chat.services.interfaces;

import com.example.chat.models.ChatRoomHistory;

public interface IChatRoomHistoryService {
    public ChatRoomHistory getHistory(String chatroomId);
}
