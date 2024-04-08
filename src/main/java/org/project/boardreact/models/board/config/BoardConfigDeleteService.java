package org.project.boardreact.models.board.config;

import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.entities.Board;
import org.project.boardreact.repositories.BoardRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardConfigDeleteService {

    private final BoardRepository repository;
    private final Utils utils;

    /**
     * 게시판 설정 삭제
     *
     * @param bId
     */
    public void delete(String bId) {
        Board board = repository.findById(bId).orElseThrow(BoardNotFoundException::new);

        repository.delete(board);
        repository.flush();
    }

    /**
     * 목록에서 일괄 삭제
     *
     * @param idxes
     */
    public void delete(List<Integer> idxes) throws BadRequestException {
        if (idxes == null || idxes.isEmpty()) {
            throw new BadRequestException(Utils.getMessage("삭제할 게시판을 선택하세요.","validation"));
        }

        // 인덱스 값 확인을 위한 로깅 추가
        System.out.println("삭제할 인덱스 목록: " + idxes);

        for (int idx : idxes) {
            // 인덱스 값 확인을 위한 로깅 추가
            System.out.println("현재 인덱스: " + idx);
            String bId = utils.getParam("bId_" + idx);
            System.out.println("bid 가져오기:" + bId);
            Board board = repository.findById(bId).orElse(null);
            if (board == null) continue;

            repository.delete(board);
        }

        repository.flush();
    }
}
