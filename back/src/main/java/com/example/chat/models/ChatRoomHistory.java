package com.example.chat.models;

import lombok.*;
import jakarta.persistence.*;

import java.util.List;

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

    /*@NonNull
    @Column(name = "name", unique = true)
    private String name;*/

    @OneToMany(mappedBy = "chatroom")
    private List<ChatMessage> chatMessages;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // !!! replace with owner
}
