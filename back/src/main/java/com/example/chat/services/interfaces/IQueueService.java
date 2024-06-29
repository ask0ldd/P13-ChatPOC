package com.example.chat.services.interfaces;

import com.example.chat.models.User;

import java.util.Set;

public interface IQueueService {
    public Set<User> getUsers();

    public Set<User> addUser(User user);

    public Set<User> removeUser(User user);

    public Set<User> removeUser(String username);
}