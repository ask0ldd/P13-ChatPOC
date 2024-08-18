package com.example.chat.services;

import com.example.chat.dtos.projections.UserProjectionDto;
import com.example.chat.exceptions.UserNotFoundException;
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

    private Set<UserProjectionDto> chatQueue;

    public QueueService(){
        chatQueue = new HashSet<>();
    }

    public Set<UserProjectionDto> getUsers(){
        return this.chatQueue;
    }

    public Set<UserProjectionDto> addUser(UserProjectionDto user){
        this.chatQueue.add(user);
        return this.chatQueue;
    }

    public Set<UserProjectionDto> removeUser(UserProjectionDto user){
        this.chatQueue.removeIf(inQueueUser -> inQueueUser.equals(user));
        return this.chatQueue;
    }

    public Set<UserProjectionDto> removeUser(String username){
        this.chatQueue.removeIf(inQueueUser -> inQueueUser.getUsername().equals(username));
        return this.chatQueue;
    }

}
