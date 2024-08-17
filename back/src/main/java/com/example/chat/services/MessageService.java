package com.example.chat.services;

import com.example.chat.dtos.payloads.MessageDto;
import com.example.chat.exceptions.HistoryNotFoundException;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.ChatMessage;
import com.example.chat.models.ChatRoomHistory;
import com.example.chat.models.User;
import com.example.chat.repositories.ChatMessageRepository;
import com.example.chat.repositories.ChatRoomHistoryRepository;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.interfaces.IMessageService;
import org.springframework.stereotype.Service;

@Service
public class MessageService implements IMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomHistoryRepository chatRoomHistoryRepository;
    private final UserRepository userRepository;

    public MessageService(ChatMessageRepository chatMessageRepository, ChatRoomHistoryRepository chatRoomHistoryRepository, UserRepository userRepository){
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomHistoryRepository = chatRoomHistoryRepository;
        this.userRepository = userRepository;
    }

    public ChatMessage saveMessage(String chatroomName, MessageDto receivedMessage){
        // User chatroomOwner = userRepository.findByChatRoomId(chatRoomId).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        // ChatRoomHistory chatroom = chatRoomHistoryRepository.findByName(chatRoomName).orElseThrow(() -> new HistoryNotFoundException("Target user cannot be found."));
        User sender = userRepository.findByUsername(receivedMessage.getSender()).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        /*ChatRoomHistory chatroom = chatRoomHistoryRepository.findByOwner(chatroomOwner)
                .orElseGet(() -> ChatRoomHistory.builder().owner(chatroomOwner).build());*/
        ChatRoomHistory chatroom = chatRoomHistoryRepository.findByName(chatroomName).orElseThrow(() -> new HistoryNotFoundException("Target user cannot be found."));
        ChatRoomHistory newChatRoom = chatRoomHistoryRepository.save(chatroom);
        ChatMessage chatMessage = ChatMessage.builder()
                .sender(sender)
                .type(receivedMessage.getType())
                .content(receivedMessage.getContent())
                .chatroom(newChatRoom).build();
        return chatMessageRepository.save(chatMessage);
    }
}
