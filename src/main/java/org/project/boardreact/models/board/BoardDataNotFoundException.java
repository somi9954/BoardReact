package org.project.boardreact.models.board;


import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.exceptions.BadRequestException;

public class BoardDataNotFoundException extends BadRequestException {
    public BoardDataNotFoundException() {
        super(Utils.getMessage("NotFound.boardData", "error"));
    }
}
