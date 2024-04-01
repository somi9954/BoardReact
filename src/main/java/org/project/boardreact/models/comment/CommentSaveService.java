package org.project.boardreact.models.comment;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.api.controllers.comments.CommentForm;
import org.project.boardreact.api.controllers.comments.CommentFormValidator;
import org.project.boardreact.commons.MemberUtil;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.entities.CommentData;
import org.project.boardreact.models.board.BoardDataNotFoundException;
import org.project.boardreact.models.comment.CommentInfoService;
import org.project.boardreact.repositories.BoardDataRepository;
import org.project.boardreact.repositories.CommentDataRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;

@Service
@RequiredArgsConstructor
public class CommentSaveService {
    private final CommentDataRepository commentDataRepository;
    private final BoardDataRepository boardDataRepository;
    private final CommentInfoService commentInfoService;

    private final CommentFormValidator validator;
    private final MemberUtil memberUtil;
    private final PasswordEncoder encoder;

    public void save(CommentForm form, Errors errors) {
        validator.validate(form, errors);
        if (errors.hasErrors()) {
            return;
        }

        CommentData commentData = null;
        Long seq = form.getSeq();
        System.out.println(form);
        if (seq == null) { // 추가 - 게시글 번호, 회원 번호
            commentData = new CommentData();
            Long boardDataSeq = form.getBoardDataSeq();
            BoardData boardData = boardDataRepository.findById(boardDataSeq).orElseThrow(BoardDataNotFoundException::new);
            commentData.setBoardData(boardData);
            commentData.setMember(memberUtil.getMember());

        } else { // 수정
            commentData = commentDataRepository.findById(seq).orElseThrow(CommentNotFoundException::new);
        }

        commentData.setPoster(form.getPoster());
        commentData.setContent(form.getContent());

        String guestPw = form.getGuestPw();
        if (StringUtils.hasText(guestPw)) {
            commentData.setGuestPw(encoder.encode(guestPw));
        }

        save(commentData);

    }

    public void save(CommentData comment) {

        commentDataRepository.saveAndFlush(comment);

        // 총 댓글 갯수 업데이트
        Long boardDataSeq = comment.getBoardData().getSeq();
        commentInfoService.updateCommentCnt(boardDataSeq);
    }
}

