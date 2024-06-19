package com.example.chat.services;

import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.User;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.interfaces.IQueueService;

import java.util.ArrayList;
import java.util.List;

public class QueueService implements IQueueService {

    private List<User> chatQueue;
    private final UserRepository userRepository;

    public QueueService(UserRepository userRepository){
        chatQueue = new ArrayList<>();
        this.userRepository = userRepository;

    }

    public List<User> getUsers(){
        return this.chatQueue;
    }

    public void addUser(Long userId){
        User user = this.userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        this.chatQueue.add(user);
    }

    public void removeUser(User inQueueUser){
        this.chatQueue.removeIf(user -> user.equals(inQueueUser));
    }

}
