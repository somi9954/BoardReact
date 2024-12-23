package org.project.boardreact.api.controllers.board;

import lombok.Data;

@Data
public class BoardDataSearch {
    private String bId;
    private int page = 1;
    private int limit = 400;

    private String category;
    private String sopt;
    private String skey;
}