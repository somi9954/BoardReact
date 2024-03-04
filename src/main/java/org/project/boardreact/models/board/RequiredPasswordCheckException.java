package org.project.boardreact.models.board;


import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.exceptions.CommonException;
import org.springframework.http.HttpStatus;

public class RequiredPasswordCheckException extends CommonException {
    public RequiredPasswordCheckException() {
        super(Utils.getMessage("Required.guestPw.check", "validation"), HttpStatus.UNAUTHORIZED);
    }
}
