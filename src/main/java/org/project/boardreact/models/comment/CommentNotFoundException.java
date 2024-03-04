package org.project.boardreact.models.comment;


import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.exceptions.BadRequestException;

public class CommentNotFoundException extends BadRequestException {

    public CommentNotFoundException() {
        super(Utils.getMessage("NotFound.comment", "error"));
    }
}
