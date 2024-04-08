package org.project.boardreact.api.controllers.board;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public class BoardUpdateForm  extends BoardForm{
    public BoardUpdateForm() {
        this.setMode("update");
    }

    private String mode = "update";

    private Long seq;

    private String bId;

    private String gid = UUID.randomUUID().toString();

    private String category;

    @NotBlank
    private String subject;

    @NotBlank
    private String poster;

    @NotBlank
    private String content;

    private boolean notice;

    private String guestPw;
}
