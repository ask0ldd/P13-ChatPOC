package com.example.chat.services.interfaces;

import com.example.chat.models.User;

import java.util.Set;

public interface IQueueService {
    public Set<User> getUsers();

    public void addUser(User user);

    public void removeUser(User user);

    public void removeUser(String username);
}