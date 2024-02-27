package org.project.boardreact.file.controllers;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
public class RequestFileUpload {
    private MultipartFile[] file;
    private String gid = UUID.randomUUID().toString();
    private String location;
    private Boolean imageOnly;
    private Boolean single;
}
