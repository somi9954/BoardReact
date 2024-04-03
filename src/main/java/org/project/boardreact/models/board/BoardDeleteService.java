package org.project.boardreact.models.board;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.models.comment.CommentDeleteService;
import org.project.boardreact.models.file.FileDeleteService;
import org.project.boardreact.repositories.BoardDataRepository;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardDeleteService {
    private final BoardInfoService infoService;
    private final BoardDataRepository repository;
    private final FileDeleteService fileDeleteService;
    private final CommentDeleteService commentDeleteService;

    public void delete(Long seq) {
        BoardData data = infoService.get(seq);
        String gid = data.getGid();

        // 해당 보드에 대한 댓글 삭제
        commentDeleteService.delete(seq);

        // 파일 삭제
        fileDeleteService.deleteByGid(gid);

        // 게시글 삭제
        repository.delete(data);

        repository.flush();
    }
}