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


    public void update(List<Integer> idxes) {
        if (idxes == null || idxes.isEmpty()) {
            throw new BadRequestException(Utils.getMessage("Not_Board","validation"));
        }

        for (int idx : idxes) {
            String bId = utils.getParam("bId_" + idx);
            Board board = boardRepository.findById(bId).orElse(null);
            if (board == null) continue;

            String bName = utils.getParam("bName_" + idx);
            boolean active = Boolean.parseBoolean(utils.getParam("active_" + idx));
            BoardAuthority authority =
                    BoardAuthority.valueOf(utils.getParam("authority_" + idx));

            board.setBName(bName);
            board.setActive(active);
            board.setAuthority(authority);
        }

        boardRepository.flush();
    }
}