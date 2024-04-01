package org.project.boardreact.api.controllers.comments;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.rests.JSONData;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.entities.CommentData;
import org.project.boardreact.models.board.RequiredPasswordCheckException;
import org.project.boardreact.models.comment.CommentDeleteService;
import org.project.boardreact.models.comment.CommentInfoService;
import org.project.boardreact.models.comment.CommentSaveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentSaveService saveService;
    private final CommentDeleteService deleteService;
    private final CommentInfoService infoService;
    private final Utils utils;

    @GetMapping("/update/{seq}")
    public ResponseEntity<CommentForm> updateComment(@PathVariable("seq") Long seq) {
        infoService.isMine(seq);
        CommentForm form = infoService.getForm(seq);
        return ResponseEntity.ok(form);
    }

    @PostMapping("/save")
    public ResponseEntity<JSONData> saveComment(@Valid @RequestBody CommentForm form, Errors errors) {
        // 서비스를 사용하여 댓글 저장
        saveService.save(form, errors);

        // 받은 데이터를 출력
        System.out.println("Received comment data: " + form.toString());

        if (errors.hasErrors()) {
            // 에러가 있으면 에러 메시지를 출력
            System.err.println("Error occurred while saving comment: " + errors.getAllErrors());

            // 에러가 있으면 에러 응답 반환
            JSONData errorResponse = new JSONData();
            errorResponse.setMessage("댓글 저장에 실패하였습니다.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // 성공을 나타내는 응답 반환
        JSONData successResponse = new JSONData();
        successResponse.setMessage("댓글이 성공적으로 저장되었습니다");
        return ResponseEntity.ok(successResponse);
    }

    @GetMapping("/list/{boardDataSeq}")
    public ResponseEntity<List<CommentData>> getComments(@PathVariable("boardDataSeq") Long boardDataSeq) {
        // 로그 추가: 요청이 도착했음을 알리는 로그
        System.out.println("댓글 목록 조회 요청 도착: " + boardDataSeq);

        List<CommentData> commentData = infoService.getList(boardDataSeq);

        // 댓글 목록 조회 결과 프린트
        System.out.println("댓글 목록 조회 결과: " + commentData);

        return ResponseEntity.status(HttpStatus.OK).body(commentData);
    }

    @DeleteMapping("/delete/{seq}")
    public ResponseEntity<JSONData> deleteComment(@PathVariable("seq") Long seq) {
        BoardData boardData = deleteService.delete(seq);
        JSONData responseData = new JSONData();
        responseData.setData(boardData);
        responseData.setMessage("게시글 삭제 성공");
        ResponseEntity.ok(responseData);
        // 성공 메시지 출력
        System.out.println("댓글 삭제 요청 성공:");
        System.out.println("메시지: " + responseData.getMessage());
        return ResponseEntity.ok(responseData);
    }

    @ExceptionHandler(RequiredPasswordCheckException.class)
    public ResponseEntity<String> handlePasswordCheckException(RequiredPasswordCheckException e) {
        ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        // 에러 메시지 출력
        System.out.println("비밀번호 확인 예외 발생:");
        System.out.println("에러 메시지: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
}
