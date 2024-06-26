package com.example.chat.services;

import com.example.chat.models.User;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.interfaces.IQueueService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class QueueService implements IQueueService {

    private Set<User> chatQueue;
    // private final UserRepository userRepository;

    public QueueService(UserRepository userRepository){
        chatQueue = new HashSet<>();
        // this.userRepository = userRepository;
    }

    public Set<User> getUsers(){
        return this.chatQueue;
    }

    public void addUser(User user){
        // User user = this.userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        this.chatQueue.add(user);
    }

    public void removeUser(User user){
        this.chatQueue.removeIf(inQueueUser -> inQueueUser.equals(user));
    }

    public void removeUser(String username){
        this.chatQueue.removeIf(inQueueUser -> inQueueUser.getUsername().equals(username));
    }

}
