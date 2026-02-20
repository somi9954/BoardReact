package org.project.boardreact.api.controllers.members;

import jakarta.validation.constraints.Size;

public record RequestProfileUpdate(
        @Size(min = 2, max = 40)
        String nickname,

        String mobile,

        @Size(min = 8)
        String password,

        String confirmPassword
) {
}
