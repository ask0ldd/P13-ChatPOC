package com.example.chat.models;

import lombok.*;
import jakarta.persistence.*;

import java.util.List;

@Entity(name = "sessions")
@Data
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NonNull
    @Column(name = "name", unique = true)
    private String name;

    @OneToMany(mappedBy = "sessions")
    private List<ChatMessage> chatMessages;
}
