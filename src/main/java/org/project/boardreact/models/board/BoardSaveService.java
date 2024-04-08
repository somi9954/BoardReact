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
            return;
        }

        save(form, bId);
    }

    public void save(BoardForm form, String bId) {
        Long seq = form.getSeq();
        String mode = Objects.requireNonNullElse(form.getMode(), "write");

        // 게시판 설정 조회 + 글쓰기 권한 체크
        Board board = infoService.get(bId, true);

        if (board == null) {
            throw new BoardNotFoundException();
        }

        String gid = form.getGid();
        BoardData data = null;
        if (mode.equals("update") && seq != null) {

            data = boardDataRepository.findById(seq).orElseThrow(() -> new BoardDataNotFoundException());
        } else {
            data = new BoardData();
            data.setBoard(board);
            data.setGid(gid);
            data.setMember(memberUtil.getMember());

        }

        data.setSubject(form.getSubject());
        data.setContent(form.getContent());
        data.setPoster(form.getPoster());
        data.setCategory(form.getCategory());



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

