package org.project.boardreact.models.board;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.models.comment.CommentDeleteService;
import org.project.boardreact.models.file.FileDeleteService;
import org.project.boardreact.repositories.BoardDataRepository;
import org.project.boardreact.repositories.CommentDataRepository;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardDeleteService {
    private final BoardInfoService infoService;
    private final BoardDataRepository repository;
    private final FileDeleteService fileDeleteService;
    private final CommentDeleteService commentDeleteService;
    private final CommentDataRepository commentDataRepository;

    public void delete(Long seq) {
        BoardData data = infoService.get(seq);
        String gid = data.getGid();

        // 해당 게시글의 댓글을 조회하여 댓글이 있는지 확인
        boolean hasComments = !commentDataRepository.findById(seq).isEmpty();

        // 댓글이 있는 경우에만 댓글 삭제
        if (hasComments) {
            commentDeleteService.delete(seq);
        }

        // 파일 삭제
        fileDeleteService.deleteByGid(gid);

        // 게시글 삭제
        repository.delete(data);

        repository.flush();
    }
}