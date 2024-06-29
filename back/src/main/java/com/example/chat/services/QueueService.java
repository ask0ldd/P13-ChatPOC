package com.example.chat.services;

import com.example.chat.models.User;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.interfaces.IQueueService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
// @Component
// list thread safe : ConcurrentSkipListSet
// Set<String> synchronizedSet = Collections.synchronizedSet(new HashSet<>());
public class QueueService implements IQueueService {

    private Set<User> chatQueue;

    public QueueService(UserRepository userRepository){
        chatQueue = new HashSet<>();
    }

    public Set<User> getUsers(){
        return this.chatQueue;
    }

    public Set<User> addUser(User user){
        this.chatQueue.add(user);
        return this.chatQueue;
    }

    public Set<User> removeUser(User user){
        this.chatQueue.removeIf(inQueueUser -> inQueueUser.equals(user));
        return this.chatQueue;
    }

    public Set<User> removeUser(String username){
        this.chatQueue.removeIf(inQueueUser -> inQueueUser.getUsername().equals(username));
        return this.chatQueue;
    }

}
