package org.project.boardreact.commons.exceptions;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class BadRequestException extends CommonException{

    public BadRequestException(Map<String, ?> messages) {
        super(messages, HttpStatus.BAD_REQUEST);
    }

    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
