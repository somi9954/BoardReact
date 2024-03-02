package org.project.boardreact.models.board;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.repositories.BoardDataRepository;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardDeleteService {
    private final BoardInfoService infoService;
    private final BoardDataRepository repository;
    private final FileDeleteService fileDeleteService;

    public void delete(Long seq) {
        BoardData data = infoService.get(seq);
        String gid = data.getGid();

        // 파일 삭제
        fileDeleteService.deleteByGid(gid);

        // 게시글 삭제
        repository.delete(data);

        repository.flush();

    }
}