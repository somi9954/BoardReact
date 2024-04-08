package org.project.boardreact.commons.contansts;

import java.util.Arrays;
import java.util.List;

public enum BoardAuthority {
    ALL("비회원+회원+관리자"),
    USER("회원+관리자"),
    ADMIN("관리자");

    private final String title;

    BoardAuthority(String title) {
        this.title = title;
    }

    public static boolean isValid(String value) {
        for (BoardAuthority authority : BoardAuthority.values()) {
            if (authority.name().equals(value)) {
                return true;
            }
        }
        return false;
    }

    public static List<String[]> getList() {
        return Arrays.asList(
                new String[] { ALL.name(), ALL.title },
                new String[] { USER.name(), USER.title},
                new String[] { ADMIN.name(), ADMIN.title }
        );
    }

    public String getTitle() {
        return title;
    }
}
