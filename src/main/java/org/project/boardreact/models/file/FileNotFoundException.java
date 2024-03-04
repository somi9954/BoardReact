package org.project.boardreact.models.file;


import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.exceptions.BadRequestException;

public class FileNotFoundException extends BadRequestException {

    public FileNotFoundException() {
        super(Utils.getMessage("NotFound.file", "error"));
    }
}