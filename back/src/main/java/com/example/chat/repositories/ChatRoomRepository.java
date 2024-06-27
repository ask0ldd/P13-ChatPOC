package com.example.chat.repositories;

import com.example.chat.models.ChatRoomHistory;
import com.example.chat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoomHistory, Long> {
    // Optional<ChatSession> findByName(String sessionName);
    Optional<ChatRoomHistory> findByUser(User user);
}
