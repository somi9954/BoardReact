package org.project.boardreact.api.controllers.comments;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.entities.Member;


@Data
public class CommentForm {
    private Long seq; // 댓글 등록 번호 
    private Long boardDataSeq; // 게시글 등록 번호

    @NotBlank
    private String poster;

    private String guestPw;

    @NotBlank
    private String content;

    private Member member;

    private BoardData boardData;

}
