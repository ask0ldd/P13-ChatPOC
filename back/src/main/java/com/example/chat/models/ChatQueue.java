package com.example.chat.models;

import java.util.ArrayList;
import java.util.List;

public class ChatQueue {

    private List<ConnectedUser> connectedUsers = new ArrayList<>();

    // move to a service
    public void addUserToQueue(ConnectedUser user){
        connectedUsers.add(user);
        user.unassign();
    }

    public void removeUserFromQueue(ConnectedUser connectedUser){
        connectedUsers.removeIf(user -> user.equals(connectedUser));
    }
}
