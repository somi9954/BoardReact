package org.project.boardreact.models.board.config;


import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.exceptions.BadRequestException;


public class BoardNotFoundException extends BadRequestException {
    public BoardNotFoundException() {
        super(Utils.getMessage("NotFound.board", "error"));
    }
}
