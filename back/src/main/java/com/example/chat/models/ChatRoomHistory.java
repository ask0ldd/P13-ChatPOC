package com.example.chat.models;

import lombok.*;
import jakarta.persistence.*;

import java.util.List;

// @MappedSuperclass
@Entity(name = "sessions")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoomHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "chatroom")
    private List<ChatMessage> chatMessages;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;
}
