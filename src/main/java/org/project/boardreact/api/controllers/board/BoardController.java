package org.project.boardreact.api.controllers.board;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.boardreact.commons.ListData;
import org.project.boardreact.commons.MemberUtil;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.exceptions.BadRequestException;
import org.project.boardreact.commons.rests.JSONData;
import org.project.boardreact.entities.Board;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.models.board.*;
import org.project.boardreact.models.board.config.BoardConfigInfoService;
import org.project.boardreact.models.board.config.BoardNotFoundException;
import org.project.boardreact.models.comment.CommentInfoService;
import org.project.boardreact.models.comment.CommentNotFoundException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor
public class BoardController {
    private final MemberUtil memberUtil;
    private final BoardInfoService infoService;
    private final BoardDeleteService deleteService;
    private final BoardSaveService saveService;
    private final BoardConfigInfoService configInfoService;
    private final CommentInfoService commentInfoService;
    private final HttpSession session;
    private  BoardData boardData;


    @PostMapping("/write/{bId}")
    public ResponseEntity<JSONData> write(@PathVariable("bId") String bId, @RequestBody BoardForm form, HttpServletRequest request, Errors errors) {
        // 클라이언트가 보낸 요청의 로그를 확인하여 보드 ID가 올바르게 전달되었는지 확인합니다.
        System.out.println("Received request: " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("Board ID received from client: " + bId);

        // 클라이언트가 보낸 요청의 컨텐츠를 확인하여 올바른 데이터가 포함되어 있는지 확인합니다.
        System.out.println("BoardForm received from client: " + form.toString());

        // 클라이언트가 보낸 요청의 헤더를 확인하여 필요한 인증 또는 권한이 있는지 확인합니다.
        String authToken = request.getHeader("Authorization");
        System.out.println("Authorization token received from client: " + authToken);


        if (bId == null || bId.isEmpty()) {
            // 클라이언트가 보낸 게시판 ID가 null 또는 빈 문자열인 경우에 대한 처리
            throw new IllegalArgumentException("Board ID cannot be null or empty");
        }

        if (errors.hasErrors()) {
            // 유효성 검사 오류 메시지 생성
            String errorMessage = errors.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            // BadRequestException으로 예외 처리
            throw new BadRequestException(errorMessage);
        }

        saveService.save(form, bId);


        JSONData data = new JSONData();
        data.setStatus(HttpStatus.CREATED);
        data.addData(bId);

        return ResponseEntity.status(data.getStatus()).body(data);
    }

    @PutMapping("/update/{seq}")
    public ResponseEntity<JSONData> update(@PathVariable("seq") Long seq , @RequestBody BoardUpdateForm form, Errors errors) {
        if (!infoService.isMine(seq)) {
            throw new BadRequestException("작성한 게시글만 수정할 수 있습니다.");
        }

        if (errors.hasErrors()) {
            // 유효성 검사 오류 메시지 생성
            String errorMessage = errors.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            // BadRequestException으로 예외 처리
            throw new BadRequestException(errorMessage);
        }

        BoardForm boardForm = infoService.getForm(seq);
        System.out.println("수정 전:" +  seq);

        // 클라이언트가 보낸 요청의 컨텐츠를 확인하여 올바른 데이터가 포함되어 있는지 확인합니다.
        System.out.println("BoardForm received from client: " + form.toString());

        // 수정된 데이터전달
        saveService.save(form, boardForm.getBId());
        System.out.println("저장된 폼:" + form);

        JSONData data = new JSONData();
        data.setStatus(HttpStatus.CREATED);

        return ResponseEntity.status(data.getStatus()).body(data);
    }

    @PostMapping("/save")
    public ResponseEntity<JSONData> save(@Valid @RequestBody BoardForm form, Errors errors) {
        String mode = Objects.requireNonNullElse(form.getMode(), "write");
        String bId = form.getBId();

        commonProcess(bId, mode);

        if (mode.equals("update")) {
            Long seq = form.getSeq();
            if (!infoService.isMine(seq)) {
                throw new BadRequestException("작성한 게시글만 수정할 수 있습니다.");
            }
        }


        if (errors.hasErrors()) {
            String message = errors.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.joining(","));
            throw new BadRequestException(message);
        }

        saveService.save(form,bId);

        JSONData data = new JSONData();
        data.setStatus(HttpStatus.OK);
        return ResponseEntity.status(data.getStatus()).body(data);
    }

    @GetMapping("/view/{seq}")
    public ResponseEntity<JSONData> view(@PathVariable("seq") Long seq, BoardDataSearch search) {

        // 게시글 조회수 업데이트
        infoService.updateView(seq);

        // 댓글 수 업데이트
        commentInfoService.updateCommentCnt(seq);

        // 게시글 및 댓글 수 조회
        BoardData data = infoService.get(seq);
        Long commentCount = (long) data.getCommentCnt(seq);


        JSONData<BoardData> responseData = new JSONData<>(data);
        responseData.addData("commentCount", commentCount);


        responseData.addData(infoService.getList(search).getContent());
        responseData.addData(commonProcess(data.getBoard().getBId(), "view"));

        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/delete/{seq}")
    public ResponseEntity<JSONData> delete(@PathVariable("seq") Long seq) {
        if (!infoService.isMine(seq)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new JSONData("작성한 게시글만 삭제할 수 있습니다."));
        }

        deleteService.delete(seq);

        JSONData responseData = new JSONData();
        responseData.setMessage("게시글이 성공적으로 삭제되었습니다.");
        return ResponseEntity.ok().body(responseData);
    }

    @GetMapping("/list/{bId}")
    public JSONData<List<BoardData>> list(@PathVariable("bId") String bId, BoardDataSearch search) {
        search.setBId(bId);
        System.out.println("Received request for board list with bId: " + bId);


        int page = search.getPage();
        int limit = search.getLimit();
        System.out.println("Requested page: " + page);
        System.out.println("Requested limit: " + limit);


        ListData<BoardData> boardList = infoService.getList(search);
        System.out.println("boardList" + boardList);

        JSONData<List<BoardData>> jsonData = new JSONData<>();

        if (boardList != null) {
            jsonData.setData(boardList.getContent());
            System.out.println("Board List Data: " + jsonData); // 게시판 리스트 데이터 출력

            // 서비스에서 가져온 게시판 데이터가 올바른지 확인하기 위해 각 게시물의 bId를 출력합니다.
            for (BoardData boardData : boardList.getContent()) {
                System.out.println("Board ID of the retrieved data: " + boardData.getBoard().getBId());
                commentInfoService.updateCommentCnt(boardData.getSeq());
            }
        } else {
            System.out.println("Board List Data is null");
        }

        return jsonData;
    }



    @PostMapping("/guest/password")
    public ResponseEntity<Map<String, Object>> guestPasswordCheck(@RequestParam("password") String password, Authentication authentication) {
        Map<String, Object> responseData = new HashMap<>();

        // 사용자 인증 확인
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Unauthorized"));
        }


        Long seq = (Long) session.getAttribute("guest_seq");
        Long commentSeq = (Long) session.getAttribute("comment_seq");

        if (commentSeq != null) {
            // 비회원 댓글의 경우 별도의 처리 로직을 수행한다.
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Invalid request"));
        }

        if (seq == null) {
            // 게스트 시퀀스가 없으면 오류 응답 반환
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Guest sequence not found"));
        }

        // 비밀번호 검증
        boolean passwordValid = infoService.checkGuestPassword(seq, password);
        if (!passwordValid) {
            // 비밀번호가 일치하지 않으면 오류 응답 반환
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Password does not match"));
        }

        // 검증 성공시 응답 데이터 설정
        String key = "chk_" + seq;
        responseData.put("message", "Guest password validation successful");

        return ResponseEntity.ok(responseData);
    }

    private ResponseEntity<Map<String, Object>> guestCommentPasswordCheck(Long seq, String password, HttpSession session) {
        Map<String, Object> responseData = new HashMap<>();

        if (seq == null) {
            throw new CommentNotFoundException();
        }

        if (!commentInfoService.checkGuestPassword(seq, password)) { // 비번 검증 실패시
            responseData.put("error", Utils.getMessage("비밀번호가_일치하지_않습니다.", "error"));
            return ResponseEntity.badRequest().body(responseData);
        }

        // 검증 성공시
        String key = "chk_comment_" + seq;
        session.setAttribute(key, true);

        responseData.put("message", "Guest password validation successful");
        return ResponseEntity.ok(responseData);
    }

    private ResponseEntity<JSONData> commonProcess(String bId, String mode) {
        JSONData responseData = new JSONData();

        Board board = configInfoService.get(bId);
        if (board == null || (!board.isActive() && !memberUtil.isAdmin())) {
            throw new BoardNotFoundException();
        }

        String category = board.getCategory();
        List<String> categories = StringUtils.hasText(category) ?
                Arrays.stream(category.trim().split("\\n"))
                        .map(s -> s.replaceAll("\\r", ""))
                        .collect(Collectors.toList())
                : null;

        String bName = board.getBName();
        String pageTitle = bName;
        if (mode.equals("write")) pageTitle = bName + " 작성";
        else if (mode.equals("update")) pageTitle = bName + " 수정";
        else if (mode.equals("view") && boardData != null) {
            pageTitle = boardData.getSubject() + "||" + bName;
        }

        List<String> addCommonScript = new ArrayList<>();
        List<String> addScript = new ArrayList<>();

        if (mode.equals("write") || mode.equals("update")) {
            addCommonScript.add("ckeditor/ckeditor");
            addCommonScript.add("fileManager");

            addScript.add("board/form");
        }

        responseData.setData(board);
        responseData.addData("categories", categories);
        responseData.addData("pageTitle", pageTitle);
        responseData.addData("addCommonScript", addCommonScript);


        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/guestPassword")
    public ResponseEntity<String> guestPassword(@RequestBody PasswordRequest passwordRequest) {
        if (passwordRequest.getPassword().equals("guest")) {
            return ResponseEntity.ok("Welcome, Guest!");
        } else {
            throw new RequiredPasswordCheckException();
        }
    }

}
