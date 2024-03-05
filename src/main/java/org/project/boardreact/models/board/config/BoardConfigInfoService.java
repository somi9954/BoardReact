package org.project.boardreact.models.board.config;

import com.querydsl.core.BooleanBuilder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.project.boardreact.api.controllers.admins.BoardConfigForm;
import org.project.boardreact.api.controllers.admins.BoardSearch;
import org.project.boardreact.commons.ListData;
import org.project.boardreact.commons.MemberUtil;
import org.project.boardreact.commons.Pagination;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.contansts.BoardAuthority;
import org.project.boardreact.commons.exceptions.AuthorizationException;
import org.project.boardreact.configs.jwt.CustomJwtFilter;
import org.project.boardreact.entities.Board;
import org.project.boardreact.entities.QBoard;
import org.project.boardreact.repositories.BoardRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

import static org.springframework.data.domain.Sort.Order.desc;

@Service
@RequiredArgsConstructor
public class BoardConfigInfoService {

    private final BoardRepository repository;
    private final HttpServletRequest request;
    private final MemberUtil memberUtil;

    public Board get(String bId) {
        Board data = repository.findById(bId).orElseThrow(BoardNotFoundException::new);

        return data;
    }

    public Board get(String bId, boolean checkAuthority) {
        Board data = get(bId);
        if (!checkAuthority) {
            return data;
        }

        // 글쓰기 권한 체크
        BoardAuthority authority = data.getAuthority();
        if (authority != BoardAuthority.ALL) {
            if (!memberUtil.isLogin()) {
                throw new AuthorizationException();
            }

            if (authority == BoardAuthority.ADMIN) {
                throw new AuthorizationException();
            }
        }

        return data;
    }

    public BoardConfigForm getForm(String bId) {
        Board board = get(bId);

        BoardConfigForm form = new ModelMapper().map(board, BoardConfigForm.class);
        form.setAuthority(board.getAuthority().name());
        form.setMode("edit");

        return form;
    }

    public ListData<Board> getList(BoardSearch search) {
        BooleanBuilder andBuilder = new BooleanBuilder();

        int page = Utils.getNumber(search.getPage(), 1);
        int limit = Utils.getNumber(search.getLimit(), 20);

        /* 검색 처리 S */
        QBoard board = QBoard.board;
        // 키워드 검색
        String sopt = Objects.requireNonNullElse(search.getSopt(), "ALL");
        String skey = search.getSkey();
        if (StringUtils.hasText(skey)) {
            skey = skey.trim();

            if (sopt.equals("bId")) { // 게시판 아이디
                andBuilder.and(board.bId.contains(skey));
            } else if (sopt.equals("bName")) { // 게시판 이름
                andBuilder.and(board.bName.contains(skey));

            } else { // 통합 검색
                BooleanBuilder orBuilder = new BooleanBuilder();
                orBuilder.or(board.bId.contains(skey))
                        .or(board.bName.contains(skey));

                andBuilder.and(orBuilder);
            }
        }

        // 사용여부
        List<Boolean> active = search.getActive();
        if (active != null && !active.isEmpty()) {
            andBuilder.and(board.active.in(active));
        }

        // 글쓰기 권한
        List<BoardAuthority> authorities = search.getAuthority() == null ? null : search.getAuthority().stream().map(BoardAuthority::valueOf).toList();

        if (authorities != null && !authorities.isEmpty()) {
            andBuilder.and(board.authority.in(authorities));
        }
        /* 검색 처리 E */

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(desc("createdAt")));

        Page<Board> data = repository.findAll(andBuilder, pageable);


        Pagination pagination = new Pagination(page, (int)data.getTotalElements(), 10, limit, request);

        ListData<Board> listData = new ListData<>();
        listData.setContent(data.getContent());
        listData.setPagination(pagination);

        return listData;
    }
}