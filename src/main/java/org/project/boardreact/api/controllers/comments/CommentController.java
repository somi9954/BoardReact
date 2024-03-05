package org.project.boardreact.api.controllers.comments;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.rests.JSONData;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.models.board.RequiredPasswordCheckException;
import org.project.boardreact.models.comment.CommentDeleteService;
import org.project.boardreact.models.comment.CommentInfoService;
import org.project.boardreact.models.comment.CommentSaveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;



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

        if (errors.hasErrors()) {
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

    @DeleteMapping("/delete/{seq}")
    public ResponseEntity<JSONData> deleteComment(@PathVariable("seq") Long seq) {
        BoardData boardData = deleteService.delete(seq);
        JSONData responseData = new JSONData();
        responseData.setData(boardData);
        responseData.setMessage("게시글 삭제 성공");
        return ResponseEntity.ok(responseData);
    }

    @ExceptionHandler(RequiredPasswordCheckException.class)
    public ResponseEntity<String> handlePasswordCheckException(RequiredPasswordCheckException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
}
