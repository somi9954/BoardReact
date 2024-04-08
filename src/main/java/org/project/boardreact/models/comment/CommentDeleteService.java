package org.project.boardreact.models.comment;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.entities.CommentData;
import org.project.boardreact.repositories.BoardDataRepository; // 보드데이터 레포지토리 추가
import org.project.boardreact.repositories.CommentDataRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentDeleteService {
    private final CommentInfoService infoService;
    private final CommentDataRepository repository;
    private final BoardDataRepository boardDataRepository; // 보드데이터 레포지토리 추가

    public BoardData delete(Long seq) {
        // 댓글 정보를 가져옵니다.
        CommentData commentData = infoService.get(seq);
        BoardData boardData = commentData.getBoardData();

        // 댓글 삭제
        repository.delete(commentData);
        repository.flush();

        // 댓글 수 업데이트
        Long boardDataSeq = boardData.getSeq();
        long commentCount = repository.countByBoardDataSeq(boardDataSeq);
        boardData.setCommentCnt((int) commentCount);

        // 보드데이터 업데이트
        boardDataRepository.save(boardData);

        return boardData;
    }
}