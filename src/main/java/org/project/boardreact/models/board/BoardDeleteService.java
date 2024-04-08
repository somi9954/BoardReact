package org.project.boardreact.models.board;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.entities.CommentData;
import org.project.boardreact.models.comment.CommentDeleteService;
import org.project.boardreact.models.file.FileDeleteService;
import org.project.boardreact.repositories.BoardDataRepository;
import org.project.boardreact.repositories.CommentDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardDeleteService {
    private final BoardInfoService infoService;
    private final BoardDataRepository repository;
    private final CommentDeleteService commentDeleteService;
    private final CommentDataRepository commentDataRepository;

    public void delete(Long seq) {
        BoardData data = infoService.get(seq);
        String gid = data.getGid();



        // 게시글에 연결된 모든 댓글을 가져와 삭제합니다.
        List<CommentData> comments = commentDataRepository.findAllByBoardData(data);
        System.out.println("comments:" + comments);
        for (CommentData comment : comments) {
            commentDeleteService.delete(comment.getSeq());
        }


        // 게시글 삭제
        repository.delete(data);

        repository.flush();
    }
}