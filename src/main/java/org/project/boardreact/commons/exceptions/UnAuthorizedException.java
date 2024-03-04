package org.project.boardreact.commons.exceptions;

import org.springframework.http.HttpStatus;

public class UnAuthorizedException extends CommonException {
    public UnAuthorizedException() {
        super("UnAuthorized", HttpStatus.UNAUTHORIZED);
    }
}