package com.example.chat.dtos.responses;

import com.example.chat.models.ChatSession;
import com.example.chat.models.MessageType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatMessageResponseDto {
    private Long id;
    private String content;
    private String sender;
    private MessageType type;
    private LocalDateTime sentAt;
    private ChatSession session;
}
