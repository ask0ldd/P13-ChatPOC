package com.example.chat.exceptions;

import com.example.chat.dtos.responses.DefaultResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(HistoryNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleHistoryrNotFoundExceptions(HistoryNotFoundException ex) {
        return new ResponseEntity<DefaultResponseDto>(new DefaultResponseDto("History not found."), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleUserNotFoundExceptions(UserNotFoundException ex) {
        return new ResponseEntity<DefaultResponseDto>(new DefaultResponseDto("User not found."), HttpStatus.UNAUTHORIZED);
    }
}
