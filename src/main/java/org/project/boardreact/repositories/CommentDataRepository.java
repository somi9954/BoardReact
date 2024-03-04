package org.project.boardreact.repositories;


import org.project.boardreact.entities.CommentData;
import org.project.boardreact.entities.QCommentData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

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
}
