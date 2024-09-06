package com.example.chat.services.interfaces;

import com.example.chat.dtos.payloads.MessageDto;
import com.example.chat.exceptions.HistoryNotFoundException;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.ChatMessage;

public interface IMessageService {
    /**
     * Saves a new chat message for the specified chatroom.
     *
     * This method takes a chatroom name and a MessageDto object, creates a new ChatMessage
     * entity, and saves it to the database. It also updates the associated ChatRoomHistory.
     *
     * @param chatroomName    The name of the chatroom where the message will be saved.
     * @param receivedMessage A MessageDto object containing the details of the message to be saved.
     * @return The saved ChatMessage entity.
     * @throws UserNotFoundException   If the sender specified in the MessageDto cannot be found.
     * @throws HistoryNotFoundException If the specified chatroom cannot be found.
     */
    public ChatMessage saveMessage(String chatroomName, MessageDto receivedMessage);
}
