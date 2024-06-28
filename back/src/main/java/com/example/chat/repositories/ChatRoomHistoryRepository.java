package com.example.chat.repositories;

import com.example.chat.models.ChatRoomHistory;
import com.example.chat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomHistoryRepository extends JpaRepository<ChatRoomHistory, Long> {
    Optional<ChatRoomHistory> findByOwner(User user);
}
