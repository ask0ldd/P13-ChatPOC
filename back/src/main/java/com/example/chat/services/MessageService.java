package com.example.chat.services;

import com.example.chat.dtos.payloads.MessageDto;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.ChatMessage;
import com.example.chat.models.ChatRoom;
import com.example.chat.models.User;
import com.example.chat.repositories.ChatMessageRepository;
import com.example.chat.repositories.ChatRoomRepository;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.interfaces.IMessageService;
import org.springframework.stereotype.Service;

@Service
public class MessageService implements IMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public MessageService(ChatMessageRepository chatMessageRepository, ChatRoomRepository chatRoomRepository, UserRepository userRepository){
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
    }

    public ChatMessage saveMessage(String chatRoomId, MessageDto receivedMessage){
        User user = userRepository.findByChatRoomId(chatRoomId).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        // ChatSession session = chatSessionRepository.findByUser(user).orElseThrow(() -> new SessionNotFoundException("Target session cannot be found."));
        ChatRoom chatroom = chatRoomRepository.findByUser(user)
                .orElseGet(() -> ChatRoom.builder().user(user).build());
        ChatRoom newChatRoom = chatRoomRepository.save(chatroom);
        ChatMessage chatMessage = ChatMessage.builder()
                .sender(user)
                .type(receivedMessage.getType())
                .content(receivedMessage.getContent())
                .chatroom(newChatRoom).build();
        return chatMessageRepository.save(chatMessage);
    }
}
