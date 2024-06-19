package com.example.chat.services;

import com.example.chat.models.ConnectedUser;
import com.example.chat.services.interfaces.IQueueService;

import java.util.ArrayList;
import java.util.List;

public class QueueService implements IQueueService {

    private List<ConnectedUser> chatQueue;

    public QueueService(){
        chatQueue = new ArrayList<>();
    }

    public List<ConnectedUser> getUsers(){
        return chatQueue;
    }

    public void addUser(ConnectedUser user){
        this.chatQueue.add(user);
    }

    public void removeUser(ConnectedUser connectedUser){
        this.chatQueue.removeIf(user -> user.equals(connectedUser));
    }

}
