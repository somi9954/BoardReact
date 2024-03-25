package org.project.boardreact.api.controllers.admins;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.boardreact.commons.contansts.BoardAuthority;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class BoardConfigForm{

    private String mode = "add";

    @NotNull
    private String bId;

    @NotBlank(message = "게시판 이름을 입력하세요.")
    private String bName;

    private boolean active;

    private String authority = String.valueOf(BoardAuthority.ALL);

    private String category;

    public String getbId() {
        return bId;
    }

    public void setbId(String bId) {
        this.bId = bId;
    }

    public String getbName() {
        return bName;
    }

    public void setbName(String bName) {
        this.bName = bName;
    }


}

