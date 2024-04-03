package org.project.boardreact.api.controllers.admins;

import lombok.Data;

import java.util.List;

@Data
public class BoardSearch {
    private int page = 1;
    private int limit = 400;

    private String sopt;
    private String skey;
    private List<Boolean> active;
    private List<String> authority;
}
