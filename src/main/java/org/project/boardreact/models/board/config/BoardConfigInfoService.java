package org.project.boardreact.models.board.config;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
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
import org.project.boardreact.entities.Board;
import org.project.boardreact.entities.QBoard;
import org.project.boardreact.repositories.BoardRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


import java.util.*;


@Service
@RequiredArgsConstructor
public class BoardConfigInfoService {

    private final BoardRepository repository;
    private final HttpServletRequest request;
    private final MemberUtil memberUtil;
    private final EntityManager em;

    public Board get(String bId) {
        if (bId == null) {
            throw new IllegalArgumentException("Board ID cannot be null");
        }

        Optional<Board> optionalBoard = repository.findById(bId);
        if (optionalBoard.isEmpty()) {
            throw new BoardNotFoundException(); // 해당 ID에 해당하는 게시판이 없는 경우 예외 처리
        }

        Board data = optionalBoard.get();
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
        QBoard board = QBoard.board;
        int page = Utils.getNumber(search.getPage(), 1);
        int limit = Utils.getNumber(search.getLimit(), 20);
        int offset = (page - 1) * limit;

        BooleanBuilder andBuilder = new BooleanBuilder();

        // 검색어 및 검색 옵션 처리
        if (StringUtils.hasText(search.getSkey())) {
            String skey = search.getSkey().trim();

            if ("bId".equals(search.getSopt())) { // 게시판 아이디로 검색
                andBuilder.and(board.bId.containsIgnoreCase(skey));
            } else if ("bName".equals(search.getSopt())) { // 게시판 이름으로 검색
                andBuilder.and(board.bName.containsIgnoreCase(skey));
            } else { // 통합 검색
                andBuilder.andAnyOf(
                        board.bId.containsIgnoreCase(skey),
                        board.bName.containsIgnoreCase(skey)
                );
            }
        }

        // 사용 여부 검색 조건 추가
        if (search.getActive() != null && !search.getActive().isEmpty()) {
            andBuilder.and(board.active.in(search.getActive()));
        }

        // 글쓰기 권한 검색 조건 추가
        if (search.getAuthority() != null && !search.getAuthority().isEmpty()) {
            List<BoardAuthority> authorities = search.getAuthority().stream()
                    .map(BoardAuthority::valueOf)
                    .toList();
            andBuilder.and(board.authority.in(authorities));
        }

        PathBuilder pathBuilder = new PathBuilder(Board.class, "board");
        List<Board> items = new JPAQueryFactory(em)
                .selectFrom(board)
                .where(andBuilder)
                .offset(offset)
                .limit(limit)
                .orderBy(new OrderSpecifier<>(Order.DESC, pathBuilder.get("createdAt")))
                .fetch();

        int total = (int) new JPAQueryFactory(em)
                .selectFrom(board)
                .where(andBuilder)
                .fetchCount();

        Pagination pagination = new Pagination(page, total, 10, limit, request);

        ListData<Board> data = new ListData<>();
        data.setContent(items);
        data.setPagination(pagination);

        return data;
    }
}