package org.project.boardreact.models.board;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.project.boardreact.api.controllers.board.BoardDataSearch;
import org.project.boardreact.api.controllers.board.BoardForm;
import org.project.boardreact.commons.ListData;
import org.project.boardreact.commons.MemberUtil;
import org.project.boardreact.commons.Pagination;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.configs.jwt.TokenProvider;
import org.project.boardreact.entities.*;
import org.project.boardreact.models.comment.CommentInfoService;
import org.project.boardreact.models.file.FileInfoService;
import org.project.boardreact.models.member.MemberInfo;
import org.project.boardreact.models.member.MemberInfoService;
import org.project.boardreact.repositories.BoardDataRepository;
import org.project.boardreact.repositories.BoardViewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.project.boardreact.entities.FileInfo;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

import static org.springframework.data.domain.Sort.Order.desc;

@Service
@RequiredArgsConstructor
public class BoardInfoService {

    private final BoardDataRepository boardDataRepository;
    private final BoardViewRepository boardViewRepository;
    private final CommentInfoService commentInfoService;
    private final MemberInfoService infoService;

    private final FileInfoService fileInfoService;
    private final HttpServletRequest request;
    private final HttpSession session;
    private final EntityManager em;
    private final MemberUtil memberUtil;
    private final PasswordEncoder encoder;
    private final Utils utils;


    /**
     * 조회수 Uid
     *      비회원 - Utils::guestUid() : ip + User-Agent(브라우저 종류)
     *      회원 - 회원번호
     * @return
     */
    public int viewUid() {
        return memberUtil.isLogin() ?
                memberUtil.getMember().getUserNo().intValue() : utils.guestUid();
    }

    /**
     * 게시글 별 조회수 업데이트
     *
     * @param seq
     */
    public void updateView(Long seq) {
        // 조회 기록 추가
        try {
            BoardView boardView = new BoardView();
            boardView.setSeq(seq);
            boardView.setUid(viewUid());

            boardViewRepository.saveAndFlush(boardView);
        } catch (Exception e) {}

        // 게시글별 총 조회수 산출
        QBoardView boardView = QBoardView.boardView;
        long cnt = boardViewRepository.count(boardView.seq.eq(seq));

        // 게시글 데이터에 업데이트(viewCnt)
        BoardData data = boardDataRepository.findById(seq).orElse(null);
        if (data == null) return;

        data.setViewCnt((int)cnt);
        boardDataRepository.flush();
    }

    public BoardData get(Long seq) {

        BoardData data = boardDataRepository.findById(seq).orElseThrow(BoardDataNotFoundException::new);

        data.setComments(commentInfoService.getList(data.getSeq()));

        addFileInfo(data);

        return data;
    }

    public BoardForm getForm(Long seq) {
        BoardData data = get(seq);
        BoardForm form = new ModelMapper().map(data, BoardForm.class);
        form.setMode("update");
        form.setBId(data.getBoard().getBId());

        return form;
    }

    public ListData<BoardData> getList(BoardDataSearch search) {
        QBoardData boardData = QBoardData.boardData;
        int page = Utils.getNumber(search.getPage(), 1);
        int limit = Utils.getNumber(search.getLimit(), 20);
        int offset = (page - 1) * limit;

        String bId = search.getBId(); // 게시판 아이디
        String sopt  = Objects.requireNonNullElse(search.getSopt(), "subject_content"); // 검색 옵션
        String skey = search.getSkey(); // 검색 키워드
        String category = search.getCategory(); // 게시판 분류

        BooleanBuilder andBuilder = new BooleanBuilder();
        andBuilder.and(boardData.board.bId.eq(bId));

        // 게시판 분류 검색 처리
        if (StringUtils.hasText(category)) {
            category = category.trim();
            andBuilder.and(boardData.category.eq(category));
        }


        // 키워드 검색 처리
        if (StringUtils.hasText(skey)) {
            skey = skey.trim();

            if (sopt.equals("subject")) { // 제목 검색
                andBuilder.and(boardData.subject.contains(skey));

            } else if (sopt.equals("content")) { // 내용 검색
                andBuilder.and(boardData.content.contains(skey));

            } else if (sopt.equals("subject_content")) { // 제목 + 내용 검색
                BooleanBuilder orBuilder = new BooleanBuilder();
                orBuilder.or(boardData.subject.contains(skey))
                        .or(boardData.content.contains(skey));

                andBuilder.and(orBuilder);
            } else if (sopt.equals("poster")) { // 작성자 + 아이디
                BooleanBuilder orBuilder = new BooleanBuilder();
                orBuilder.or(boardData.poster.contains(skey))
                        .or(boardData.member.email.contains(skey))
                        .or(boardData.member.nickname.contains(skey));

                andBuilder.and(orBuilder);

            }
        }

        PathBuilder pathBuilder = new PathBuilder(BoardData.class, "boardData");
        List<BoardData> items = new JPAQueryFactory(em)
                .selectFrom(boardData)
                .leftJoin(boardData.board)
                .leftJoin(boardData.member)
                .where(andBuilder)
                .offset(offset)
                .limit(limit)
                .fetchJoin()
                .orderBy(
                        new OrderSpecifier(Order.valueOf("DESC"),
                                pathBuilder.get("createdAt")))
                .fetch();

        int total = (int)boardDataRepository.count(andBuilder);

        Pagination pagination = new Pagination(page, total, 10, limit, request);

        // 파일 정보 추가
        items.stream().forEach(this::addFileInfo);

        ListData<BoardData> data = new ListData<>();
        data.setContent(items);
        data.setPagination(pagination);

        return data;
    }


    private void addFileInfo(BoardData data) {
        String gid = data.getGid();
        List<FileInfo> editorImages = fileInfoService.getListDone(gid, "editor");
        List<FileInfo> attachFiles = fileInfoService.getListDone(gid, "attach");

        data.setEditorImages(editorImages);
        data.setAttachFiles(attachFiles);
    }

    public boolean isMine(Long seq) {
        if (memberUtil.isAdmin()) { // 관리자는 수정, 삭제 모두 가능
            return true;
        }

        // JWT 토큰을 통해 사용자 정보 추출
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false; // 인증 실패
        }

        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        MemberInfo userDetails = (MemberInfo) infoService.loadUserByUsername(email);

        BoardData data = get(seq);
        if (data.getMember() != null) {
            // 회원 등록 게시물이며 직접 작성한 게시글인 경우
            Member boardMember = data.getMember();
            return userDetails != null && userDetails.getMember().getUserNo().longValue() == boardMember.getUserNo().longValue();
        } else { // 비회원 게시글
            // 세션에 chk_게시글번호 항목이 있으면 비번 검증 완료
            String key = "chk_" + seq;
            if (session.getAttribute(key) == null) { // 비회원 비밀번호 검증 X -> 검증 화면으로 이동
                session.setAttribute("guest_seq", seq);
                throw new RequiredPasswordCheckException();
            } else { // 비회원 게시글 검증 성공시
                return true;
            }
        }
    }

    public boolean checkGuestPassword(Long seq, String password) {
        BoardData data = get(seq);
        String guestPw = data.getGuestPw();
        if (!StringUtils.hasText(guestPw)) {
            return false;
        }

        return encoder.matches(password, guestPw);
    }

    public List<BoardData> getList(String bId, int num) {

        QBoardData boardData = QBoardData.boardData;
        num = Utils.getNumber(num, 10);
        Pageable pageable = PageRequest.of(0, num, Sort.by(desc("createdAt")));
        Page<BoardData> data = boardDataRepository.findAll(boardData.board.bId.eq(bId), pageable);

        return data.getContent();
    }
}