package com.example.chat.dtos.payloads;

import com.example.chat.dtos.responses.ChatRoomHistoryResponseDto;
import com.example.chat.models.ChatMessage;
import com.example.chat.models.ChatRoomHistory;
import com.example.chat.models.MessageType;
import lombok.Data;

@Data
public class MessageDto {
    private String content;
    private String sender;
    // private String chatroomName;
    private MessageType type;
}
