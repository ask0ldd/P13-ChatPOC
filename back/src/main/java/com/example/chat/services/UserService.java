package com.example.chat.services;

import com.example.chat.dtos.projections.UserProjectionDto;
import com.example.chat.exceptions.UserNotFoundException;
import com.example.chat.models.User;
import com.example.chat.repositories.UserRepository;
import com.example.chat.services.interfaces.IUserService;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User getUser(String username){
        return this.userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
    }

    public UserProjectionDto getUserProjection(String username){
        User user = this.userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("Target user cannot be found."));
        return new UserProjectionDto(user);
    }
}
