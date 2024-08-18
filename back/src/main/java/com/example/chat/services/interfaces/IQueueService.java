package com.example.chat.services.interfaces;

import com.example.chat.dtos.projections.UserProjectionDto;
import com.example.chat.models.User;

import java.util.Set;

public interface IQueueService {

    public Set<UserProjectionDto> getUsers();

    public Set<UserProjectionDto> addUser(UserProjectionDto user);

    public Set<UserProjectionDto> removeUser(UserProjectionDto user);

    public Set<UserProjectionDto> removeUser(String username);
}