package com.example.chat.dtos.responses;

import com.example.chat.models.ChatMessage;
import com.example.chat.models.ChatRoomHistory;
import com.example.chat.models.MessageType;
import com.example.chat.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ChatRoomHistoryResponseDto {
    private Long id;
    private User owner;
    private List<LimitedMessage> messages;

    public ChatRoomHistoryResponseDto(ChatRoomHistory chatRoom){
        this.id = chatRoom.getId();
        this.owner = chatRoom.getOwner();
        this.messages = chatRoom.getChatMessages().stream().map(LimitedMessage::new).toList();
    }

    @Data
    @AllArgsConstructor
    private static class LimitedMessage{
        private String content;
        private String sender;
        private MessageType type;
        private LocalDateTime sentAt;

        public LimitedMessage(ChatMessage message){
            this.content = message.getContent();
            this.sender = message.getSender().getUsername();
            this.type = message.getType();
            this.sentAt = message.getSentAt();
        }
    }
}