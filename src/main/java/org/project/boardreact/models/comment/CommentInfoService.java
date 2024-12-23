package org.project.boardreact.models.comment;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.project.boardreact.api.controllers.comments.CommentForm;
import org.project.boardreact.commons.MemberUtil;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.exceptions.BadRequestException;
import org.project.boardreact.configs.jwt.CustomJwtFilter;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.entities.CommentData;
import org.project.boardreact.entities.Member;
import org.project.boardreact.entities.QCommentData;
import org.project.boardreact.models.board.BoardDataNotFoundException;
import org.project.boardreact.models.board.RequiredPasswordCheckException;
import org.project.boardreact.repositories.BoardDataRepository;
import org.project.boardreact.repositories.CommentDataRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CommentInfoService {

    private final CommentDataRepository commentDataRepository;
    private final BoardDataRepository boardDataRepository;
    private final MemberUtil memberUtil;
    private final EntityManager em;
    private final HttpSession session;
    private final PasswordEncoder encoder;

    public CommentData get(Long seq) {
        CommentData comment = commentDataRepository.findById(seq).orElseThrow(CommentNotFoundException::new);

        return comment;
    }

    public CommentForm getForm(Long seq) {
        CommentData comment = get(seq);
        CommentForm form = new ModelMapper().map(comment, CommentForm.class);
        form.setBoardDataSeq(comment.getBoardData().getSeq());

        return form;
    }

    /**
     * 댓글 목록
     *
     * @param boardDataSeq : 게시글 번호
     * @return
     */
    public List<CommentData> getList(Long boardDataSeq) {
        QCommentData commentData = QCommentData.commentData;

        PathBuilder<CommentData> pathBuilder = new PathBuilder<>(CommentData.class, "commentData");
        List<CommentData> items = new JPAQueryFactory(em)
                .selectFrom(commentData)
                .where(commentData.boardData.seq.eq(boardDataSeq))
                .leftJoin(commentData.member).fetchJoin()
                .orderBy(new OrderSpecifier(Order.ASC, pathBuilder.get("createdAt")))
                .fetch();

        return items;
    }

    /**
     * 댓글 수 업데이트
     *
     * @param seq
     */
    public void updateCommentCnt(Long seq) {
        // 게시글 조회
        BoardData boardData = boardDataRepository.findById(seq).orElseThrow(BoardDataNotFoundException::new);

        // 게시글 정보 출력
        System.out.println("BoardData found: " + boardData);

        // 댓글 수 조회
        int commentCount = commentDataRepository.getTotal(seq);

        // 댓글 수 출력
        System.out.println("Comment count for board with seq " + seq + ": " + commentCount);

        // 게시글의 댓글 수 업데이트
        boardData.setCommentCnt(commentCount);

        // 변경된 데이터 저장
        boardDataRepository.flush();

        // 업데이트된 댓글 수 출력
        System.out.println("Updated comment count for board with seq " + seq + ": " + boardData.getCommentCnt());
    }

    public void isMine(Long seq) {
        if (memberUtil.isAdmin()) {
            return;
        }

        CommentData data = get(seq);
        Member commentMember = data.getMember();
        if (commentMember == null) { // 비회원 작성
            String key = "chk_comment_" + seq;
            if (session.getAttribute(key) == null) { // 비회원 비밀번호 확인 전
                session.setAttribute("comment_seq", seq);
                throw new RequiredPasswordCheckException();
            }

        } else { // 로그인 상태 작성
            if (!memberUtil.isLogin()
                    || commentMember.getUserNo().longValue() != memberUtil.getMember().getUserNo().longValue()) {
                throw new BadRequestException(Utils.getMessage("작성한_댓글만_수정_삭제_가능합니다.", "error"));
            }
        }
    }

    /**
     * 수정, 삭제 가능 여부
     *  버튼 노출 여부 결정
     *
     * @param comment
     * @return
     */
    public boolean isEditable(CommentData comment) {
        Member commentMember = comment.getMember();
        if (memberUtil.isAdmin() || commentMember == null) { // 관리자이거나 비회원 댓글이면 무조건 노출
            return true;
        }

        // 회원 댓글이면 직접 작성한 댓글만 노출
        if (memberUtil.isLogin() && commentMember != null
                && commentMember.getUserNo().longValue() == memberUtil.getMember().getUserNo().longValue()) {
            return true;
        }

        return false;
    }

    /**
     * 비회원 댓글 비밀번호 확인
     *
     * @param seq
     * @param password
     * @return
     */
    public boolean checkGuestPassword(Long seq, String password) {
        CommentData comment = get(seq);

        return encoder.matches(password, comment.getGuestPw());
    }
}