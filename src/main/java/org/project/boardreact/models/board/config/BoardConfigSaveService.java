package org.project.boardreact.models.board.config;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.api.controllers.admins.BoardConfigForm;
import org.project.boardreact.api.controllers.board.BoardForm;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.contansts.BoardAuthority;
import org.project.boardreact.commons.contansts.MemberType;
import org.project.boardreact.commons.exceptions.BadRequestException;
import org.project.boardreact.entities.Board;
import org.project.boardreact.repositories.BoardRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardConfigSaveService {
    private final BoardRepository boardRepository;
    private final Utils utils;

    public void save(BoardConfigForm form) {
        String mode = form.getMode();
        mode = StringUtils.hasText(mode) ? mode : "add";
        String bid = form.getbId();

        Board board = null;
        if (mode.equals("edit") && StringUtils.hasText(bid)) {
            board = boardRepository.findById(bid).orElseThrow(BoardNotFoundException::new);
        } else {
            board = Board.builder()
                    .bId(bid)
                    .build();
        }

        board.setBName(form.getbName());
        board.setActive(form.isActive());
        board.setCategory(form.getCategory());

        board.setAuthority(BoardAuthority.valueOf(form.getAuthority()));


        boardRepository.saveAndFlush(board);
    }


    public void update(List<Integer> idxes) throws BadRequestException {
        if (idxes == null || idxes.isEmpty()) {
            throw new BadRequestException("수정할 게시판을 선택하세요.");
        }

        for (int idx : idxes) {
            String bId = utils.getParam("bId_" + idx);
            if (StringUtils.isEmpty(bId)) {
                throw new BadRequestException("게시판 ID가 없습니다.");
            }

            String bName = utils.getParam("bName_" + idx);
            if (StringUtils.isEmpty(bName)) {
                throw new BadRequestException("게시판 이름을 입력하세요.");
            }

            Board board = boardRepository.findById(bId).orElse(null);
            if (board == null) continue;

            board.setBName(bName);

            boolean active = Boolean.parseBoolean(utils.getParam("active_" + idx));
            String authorityValue = utils.getParam("authority_" + idx);
            if (StringUtils.isEmpty(authorityValue) || !BoardAuthority.isValid(authorityValue)) {
                throw new BadRequestException("유효하지 않은 권한 값입니다.");
            }
            board.setActive(active);
            board.setAuthority(BoardAuthority.valueOf(authorityValue));
        }

        boardRepository.flush();
    }
}