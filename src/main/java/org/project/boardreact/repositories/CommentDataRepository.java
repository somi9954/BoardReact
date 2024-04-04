package org.project.boardreact.repositories;


import org.project.boardreact.entities.BoardData;
import org.project.boardreact.entities.CommentData;
import org.project.boardreact.entities.QCommentData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;

public interface CommentDataRepository extends JpaRepository<CommentData, Long>, QuerydslPredicateExecutor<CommentData> {

    /**
     * 게시글별 댓글 수
     * @param boardDataSeq
     * @return
     */
    default int getTotal(Long boardDataSeq) {
        QCommentData commentData = QCommentData.commentData;

        return (int)count(commentData.boardData.seq.eq(boardDataSeq));
    }

    /**
     * 특정 게시글에 속하는 모든 댓글을 가져옵니다.
     * @param boardData 게시글 정보
     * @return 해당 게시글에 속하는 모든 댓글 목록
     */
    List<CommentData> findAllByBoardData(BoardData boardData);
}

