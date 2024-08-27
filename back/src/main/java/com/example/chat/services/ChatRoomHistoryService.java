package com.example.chat.services;

import com.example.chat.exceptions.HistoryNotFoundException;
import com.example.chat.models.ChatRoomHistory;
import com.example.chat.models.User;
import com.example.chat.repositories.ChatRoomHistoryRepository;
import com.example.chat.services.interfaces.IChatRoomHistoryService;
import org.springframework.stereotype.Service;

@Service
public class ChatRoomHistoryService implements IChatRoomHistoryService {

    private final ChatRoomHistoryRepository chatRoomHistoryRepository;

    public ChatRoomHistoryService(ChatRoomHistoryRepository chatRoomHistoryRepository){
        this.chatRoomHistoryRepository = chatRoomHistoryRepository;
    }

    public ChatRoomHistory getHistory(String chatroomName){
        ChatRoomHistory chatroom = chatRoomHistoryRepository.findByName(chatroomName).orElseThrow(() -> new HistoryNotFoundException("Target user cannot be found."));
        User user = chatroom.getOwner();
        return chatRoomHistoryRepository.findByOwner(user).orElseThrow(() -> new HistoryNotFoundException("Target session cannot be found."));
    }
}
