package com.example.chat.services.interfaces;

import com.example.chat.exceptions.HistoryNotFoundException;
import com.example.chat.models.ChatRoomHistory;

public interface IChatRoomHistoryService {
    /**
     * Retrieves the chat room history for a specified chat room.
     *
     * This method first attempts to find a chat room by its name. If found, it then retrieves
     * the chat room history associated with the owner of that chat room.
     *
     * @param chatroomName The name of the chat room to retrieve the history for.
     * @return The {@link ChatRoomHistory} object associated with the owner of the specified chat room.
     * @throws HistoryNotFoundException If either the chat room or its history cannot be found.
     *         This exception is thrown in two cases:
     *         1. When the specified chat room name does not exist.
     *         2. When the chat room exists, but no history is found for its owner.
     */
    public ChatRoomHistory getHistory(String chatroomName);
}
