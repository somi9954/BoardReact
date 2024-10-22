package org.project.boardreact.api.controllers.members;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record RequestJoin(
        @NotBlank @Email
        String email,

        @NotBlank @Size(min = 8)
        String password,

        @NotBlank
        String confirmPassword,

        @NotBlank
        String name,

        String mobile,

        @AssertTrue
        Boolean agree // 기본형으로 사용 시 레코드 클래스에서 에러가 날 수 있어서 래퍼 클래스를 사용함
) {}
