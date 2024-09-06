package com.example.chat.services.interfaces;

import com.example.chat.dtos.projections.UserProjectionDto;

import java.util.Set;

public interface IQueueService {

    /**
     * Retrieves all users currently in the queue.
     *
     * @return A Set of UserProjectionDto objects representing all users in the queue.
     */
    public Set<UserProjectionDto> getUsers();

    /**
     * Adds a new user to the queue.
     *
     * @param user The UserProjectionDto object representing the user to be added.
     * @return A Set of UserProjectionDto objects representing all users in the queue after the addition.
     */
    public Set<UserProjectionDto> addUser(UserProjectionDto user);

    /**
     * Removes a specific user from the queue based on the provided UserProjectionDto object.
     *
     * @param user The UserProjectionDto object representing the user to be removed.
     * @return A Set of UserProjectionDto objects representing all users in the queue after the removal.
     */
    public Set<UserProjectionDto> removeUser(UserProjectionDto user);

    /**
     * Removes a specific user from the queue based on the provided username.
     *
     * @param username The username of the user to be removed.
     * @return A Set of UserProjectionDto objects representing all users in the queue after the removal.
     */
    public Set<UserProjectionDto> removeUser(String username);
}