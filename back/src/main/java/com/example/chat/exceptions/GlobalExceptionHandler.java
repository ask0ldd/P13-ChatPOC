package com.example.chat.exceptions;

import com.example.chat.dtos.responses.DefaultResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(SessionNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleUserNotFoundExceptions(SessionNotFoundException ex) {
        return new ResponseEntity<DefaultResponseDto>(new DefaultResponseDto("User not found."), HttpStatus.UNAUTHORIZED);
    }
}
