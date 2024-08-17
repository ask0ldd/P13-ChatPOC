package com.example.chat.dtos.responses;

import com.example.chat.models.User;
import lombok.Data;

import java.text.ParseException;

@Data
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String chatroomName;
    private String role;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        // this.chatroomId = user.getChatRoomId();
        this.chatroomName = user.getChatroom().getName();
        this.role = user.getRole();
    }
}
