package com.example.chat.dtos.responses;

import com.example.chat.dtos.projections.UserProjectionDto;
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
        this.chatroomName = user.getChatroomName();
        this.role = user.getRole();
    }

    public UserResponseDto(UserProjectionDto user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.chatroomName = user.getChatroomName();
        this.role = user.getRole();
    }
}
