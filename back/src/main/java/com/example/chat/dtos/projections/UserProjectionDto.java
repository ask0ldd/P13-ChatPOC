package com.example.chat.dtos.projections;

import com.example.chat.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class UserProjectionDto {
    private Long id;
    private String username;
    private String email;
    private String chatroomName;
    private String role;

    public UserProjectionDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.chatroomName = user.getChatroomName();
        this.role = user.getRole();
    }
}
