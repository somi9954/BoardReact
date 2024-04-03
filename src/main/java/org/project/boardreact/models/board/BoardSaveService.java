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


import java.time.LocalDateTime;
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
            return;
        }

        save(form, bId);
    }

    public void save(BoardForm form, String bId) {
        Long seq = form.getSeq(); // 게시글의 시퀀스 번호를 가져옵니다.
        String mode = Objects.requireNonNullElse(form.getMode(), "write"); // 게시글의 작업 모드를 가져옵니다.

        // 게시판 설정 조회 + 글쓰기 권한 체크
        Board board = infoService.get(bId, true); // 게시판 설정을 조회하고, 해당 게시판의 쓰기 권한을 확인합니다.

        if (board == null) {
            throw new BoardNotFoundException(); // 게시판이 존재하지 않으면 예외를 발생시킵니다.
        }

        String gid = form.getGid(); // 게시글의 그룹 ID를 가져옵니다.

        BoardData data = null;
        if (mode.equals("update") && seq != null) {
            // 수정 모드이고 시퀀스가 있으면 기존 게시글을 가져옵니다.
            data = boardDataRepository.findById(seq).orElseThrow(() -> new BoardDataNotFoundException());
        } else {
            // 새로운 게시글을 생성합니다.
            data = new BoardData();
            data.setBoard(board); // 게시글이 속한 게시판을 설정합니다.
            data.setGid(gid); // 게시글의 그룹 ID를 설정합니다.
            data.setMember(memberUtil.getMember()); // 게시글을 작성한 회원 정보를 설정합니다.
        }

        // 폼에서 받아온 데이터를 새로운 BoardData 객체에 설정합니다.
        data.setSubject(form.getSubject());
        data.setContent(form.getContent());
        data.setPoster(form.getPoster());
        data.setCategory(form.getCategory());
        data.setModifiedAt(LocalDateTime.now()); // 수정 시간을 설정합니다.

        // 수정된 데이터를 설정합니다.
        form.updateBoardData(data);

        // 공지사항 여부를 설정합니다. (관리자만 가능)
        if (memberUtil.isAdmin()) {
            data.setNotice(form.isNotice());
        }

        // 비회원 비밀번호를 설정합니다.
        String guestPw = form.getGuestPw();
        if (StringUtils.hasText(guestPw)) {
            data.setGuestPw(encoder.encode(guestPw)); // 비밀번호를 암호화하여 설정합니다.
        }

        // 수정된 데이터를 저장합니다.
        boardDataRepository.saveAndFlush(data);
    }
}

