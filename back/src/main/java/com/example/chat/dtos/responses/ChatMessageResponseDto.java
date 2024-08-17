package com.example.chat.dtos.responses;

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
    private String chatroomName;
    private LocalDateTime sentAt;
}

/*

    private String content;
    private String sender;
    private String chatroomName;
    private MessageType type;

    public MessageDto(ChatMessage message){
        this.content = message.getContent();
        this.sender = message.getSender().getUsername();
        this.type = message.getType();
        this.chatroomName = message.getChatroom().getName();
    }
 */
