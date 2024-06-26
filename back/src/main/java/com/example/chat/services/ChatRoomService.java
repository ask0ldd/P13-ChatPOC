package com.example.chat.services;

import com.example.chat.exceptions.SessionNotFoundException;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.ChatRoom;
import com.example.chat.models.User;
import com.example.chat.repositories.ChatRoomRepository;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.interfaces.IChatRoomService;
import org.springframework.stereotype.Service;

@Service
public class ChatRoomService implements IChatRoomService {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomService(UserRepository userRepository, ChatRoomRepository chatRoomRepository){
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    public ChatRoom getHistory(String username){
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return chatRoomRepository.findByUser(user).orElseThrow(() -> new SessionNotFoundException("Target session cannot be found."));
    }
}
