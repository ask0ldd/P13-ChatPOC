package com.example.chat.repositories;

import com.example.chat.models.ChatRoom;
import com.example.chat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    // Optional<ChatSession> findByName(String sessionName);
    Optional<ChatRoom> findByUser(User user);
}
