package org.project.boardreact.api.controllers.board;

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
import org.project.boardreact.entities.FileInfo;
import org.project.boardreact.models.board.*;
import org.project.boardreact.models.board.config.BoardConfigInfoService;
import org.project.boardreact.models.board.config.BoardNotFoundException;
import org.project.boardreact.models.comment.CommentInfoService;
import org.project.boardreact.models.comment.CommentNotFoundException;
import org.project.boardreact.models.file.FileInfoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    private final FileInfoService fileInfoService;
    private final HttpSession session;
    private  BoardData boardData;



    @PostMapping("/write/{bId}")
    public ResponseEntity<JSONData> write(@PathVariable("bId") String bId, @RequestBody @Valid BoardForm form, Errors errors) {

        // 유효성 검사 오류 확인
        if (errors.hasErrors()) {
            // 유효성 검사 오류 메시지 생성
            String message = errors.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.joining(","));
            // BadRequestException으로 예외 처리
            throw new BadRequestException(Utils.getMessage("Not_Blank_write", "validation"));
        }

        saveService.save(form);

        JSONData data = new JSONData();
        data.setStatus(HttpStatus.CREATED);

        return ResponseEntity.status(data.getStatus()).body(data);
    }

    @GetMapping("/update/{seq}")
    public ResponseEntity<JSONData> update(@PathVariable("seq") Long seq) {
        if (!infoService.isMine(seq)) {
            throw new BadRequestException("작성한 게시글만 수정할 수 있습니다.");
        }

        BoardForm form = infoService.getForm(seq);

        JSONData data = new JSONData();
        data.setStatus(HttpStatus.OK);
        data.setMessage("성공");
        data.setData(form);

        return ResponseEntity.ok(data);
    }

    @PostMapping("/save")
    public ResponseEntity<JSONData> save(@Valid BoardForm form, Errors errors) {
        String mode = Objects.requireNonNullElse(form.getMode(), "write");
        String bId = form.getBId();

        commonProcess(bId, mode);

        if (mode.equals("update")) {
            Long seq = form.getSeq();
            if (!infoService.isMine(seq)) {
                throw new BadRequestException("작성한 게시글만 수정할 수 있습니다.");
            }
        }

        saveService.save(form, errors);

        if (errors.hasErrors()) {
            String gid = form.getGid();
            List<FileInfo> editorImages = fileInfoService.getListAll(gid, "editor");
            List<FileInfo> attachFiles = fileInfoService.getListAll(gid, "attach");
            form.setEditorImages(editorImages);
            form.setAttachFiles(attachFiles);

            JSONData data = new JSONData();
            data.setStatus(HttpStatus.BAD_REQUEST);
            data.setMessage("Validation error");
            return ResponseEntity.status(data.getStatus()).body(data);
        }

        JSONData data = new JSONData();
        data.setStatus(HttpStatus.OK);
        return ResponseEntity.status(data.getStatus()).body(data);
    }

    @GetMapping("/view/{seq}")
    public ResponseEntity<JSONData> view(@PathVariable("seq") Long seq,
                                         @ModelAttribute BoardDataSearch search) {
        infoService.updateView(seq);

        BoardData data = infoService.get(seq);
        boardData = data;

        String bId = data.getBoard().getBId();
        JSONData<BoardData> responseData = new JSONData<>(data); // JSONData 객체를 생성하면서 data를 설정

        // 추가 데이터를 dataList에 추가
        responseData.addData(infoService.getList(search).getContent());
        responseData.addData(commonProcess(bId, "view"));

        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/delete/{seq}")
    public ResponseEntity delete(@PathVariable Long seq) {
        try {
            BoardData data = infoService.get(seq);
            if (data == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            deleteService.delete(seq);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/list/{bId}")
    public ResponseEntity<Map<String, Object>> list(@PathVariable("bId") String bId, @ModelAttribute BoardDataSearch search) {
        Map<String, Object> responseData = new HashMap<>();

        // 공통 처리
        ResponseEntity<JSONData> commonProcessData = commonProcess(bId, "list");

        // 게시글 목록 조회
        search.setBId(bId);
        ListData<BoardData> data = infoService.getList(search);

        // 응답 데이터 설정
        responseData.put("commonProcessData", commonProcessData);
        responseData.put("items", data.getContent());
        responseData.put("pagination", data.getPagination());

        // 응답 반환
        return ResponseEntity.ok(responseData);
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
        responseData.addData("addScript", addScript);


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
