package com.example.chat.services.interfaces;

import com.example.chat.dtos.payloads.MessageDto;
import com.example.chat.models.ChatMessage;

public interface IMessageService {
    public ChatMessage saveMessage(String chatroomName, MessageDto receivedMessage);
}
