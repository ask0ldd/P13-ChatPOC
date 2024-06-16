package com.example.chat.dtos.responses;

import lombok.Data;

@Data
public class DefaultResponseDto {

    private String message;

    public DefaultResponseDto(String message) {
        this.message = message;
    }
}