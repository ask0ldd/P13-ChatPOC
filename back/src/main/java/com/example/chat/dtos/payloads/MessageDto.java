package com.example.chat.dtos.payloads;

import com.example.chat.models.MessageType;
import lombok.Data;

@Data
public class MessageDto {
    private String content;
    private String sender;
    private MessageType type;
}
