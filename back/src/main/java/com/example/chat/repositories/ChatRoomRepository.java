package com.example.chat.repositories;

import com.example.chat.models.ChatSession;
import com.example.chat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    // Optional<ChatSession> findByName(String sessionName);
    Optional<ChatSession> findByUser(User user);
}
