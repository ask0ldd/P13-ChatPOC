package com.example.chat.services.interfaces;

import com.example.chat.dtos.projections.UserProjectionDto;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.User;

public interface IUserService {
    /**
     * Retrieves a user by their username.
     *
     * @param username The username of the user to retrieve.
     * @return The User object corresponding to the given username.
     * @throws UserNotFoundException If no user is found with the given username.
     */
    public User getUser(String username);

    /**
     * Retrieves a projection of user data by username.
     *
     * @param username The username of the user whose projection is to be retrieved.
     * @return A UserProjectionDto object containing the projected user data.
     * @throws UserNotFoundException If no user is found with the given username.
     */
    public UserProjectionDto getUserProjection(String username);
}
