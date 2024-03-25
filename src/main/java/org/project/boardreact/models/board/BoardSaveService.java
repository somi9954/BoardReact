package org.project.boardreact.models.board;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.api.controllers.board.BoardForm;
import org.project.boardreact.api.controllers.board.BoardFormValidator;
import org.project.boardreact.commons.MemberUtil;
import org.project.boardreact.entities.Board;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.models.board.config.BoardConfigInfoService;
import org.project.boardreact.models.board.config.BoardNotFoundException;
import org.project.boardreact.repositories.BoardDataRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BoardSaveService {
    private final BoardDataRepository boardDataRepository;
    private final BoardConfigInfoService infoService;
    private final MemberUtil memberUtil;
    private final PasswordEncoder encoder;
    private final BoardFormValidator validator;

    public void save(BoardForm form, Errors errors, String bId) {
        validator.validate(form, errors);
        if (errors.hasErrors()) {
            return; // 유효성 검사를 통과하지 못한 경우 저장 메서드를 호출하지 않고 종료합니다.
        }

        save(form, bId);
    }

    public void save(BoardForm form, String bId) {
        Long seq = form.getSeq();
        String mode = Objects.requireNonNullElse(form.getMode(), "write");

        // 게시판 ID가 유효한지 확인
        /*if (StringUtils.isEmpty(bId)) {
            throw new IllegalArgumentException("Board ID cannot be null");
        }*/

        // 게시판 설정 조회 + 글쓰기 권한 체크
        Board board = infoService.get(bId, true);

        if (board == null) {
            throw new BoardNotFoundException();
        }

        String gid = form.getGid();

        BoardData data = null;
        if (mode.equals("update") && seq != null) {
            data = boardDataRepository.findById(seq).orElseThrow(BoardDataNotFoundException::new);
        } else {
            data = new BoardData();
            data.setBoard(board); // 게시판 bId 최초 글 등록시 한번만 등록
            data.setGid(gid); // 그룹 ID(GID)는 최초 글 등록시 한번만 등록
            data.setMember(memberUtil.getMember()); // 글 등록 회원 정보도 최초 글등록시 한번
        }


        data.setSubject(form.getSubject());
        data.setContent(form.getContent());
        data.setPoster(form.getPoster());
        data.setCategory(form.getCategory());

        // 공지사항 여부 - 관리자만 등록, 수정
        if (memberUtil.isAdmin()) {
            data.setNotice(form.isNotice());
        }

        // 비회원 비밀번호 처리
        String guestPw = form.getGuestPw();
        if (StringUtils.hasText(guestPw)) {
            data.setGuestPw(encoder.encode(guestPw));
        }

        // 수정된 데이터를 저장합니다.
        boardDataRepository.saveAndFlush(data);
    }
}

