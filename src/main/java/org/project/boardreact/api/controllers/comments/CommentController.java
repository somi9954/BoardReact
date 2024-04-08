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
import org.springframework.transaction.annotation.Transactional;
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

    @PutMapping("/update/{seq}")
    public ResponseEntity<JSONData> updateComment(@PathVariable("seq") Long seq, @RequestBody CommentForm form, Errors errors) {
        infoService.isMine(seq);

        form.setSeq(seq); // 요청에서 가져온 seq를 CommentForm에 설정

        saveService.save(form, errors);

        System.out.println("저장된 폼:" + form);

        JSONData data = new JSONData();
        data.setStatus(HttpStatus.CREATED);

        return ResponseEntity.status(data.getStatus()).body(data);
    }

    @PostMapping("/save")
    public ResponseEntity<JSONData> saveComment(@Valid @RequestBody CommentForm form, Errors errors) {
        // 서비스를 사용하여 댓글 저장
        saveService.save(form, errors);

        // 받은 데이터를 출력
        System.out.println("Received comment data: " + form.toString());
        System.out.println("댓글 시퀀스:"+ form.getSeq());

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
        try {
            // 댓글 목록 조회
            List<CommentData> commentData = infoService.getList(boardDataSeq);

            // 댓글 수 업데이트
            infoService.updateCommentCnt(boardDataSeq);

            // 업데이트된 댓글 수를 가져오는 방법은 없으므로 댓글 목록 조회 결과를 반환하고,
            // 서비스에서 댓글 수 업데이트 후에도 프린트할 수 있습니다.

            // 댓글 목록 조회 결과 프린트
            System.out.println("댓글 목록 조회 결과: " + commentData);

            return ResponseEntity.status(HttpStatus.OK).body(commentData);
        } catch (Exception e) {
            // 에러 메시지 출력
            System.out.println("댓글 목록 조회 도중 오류 발생:");
            e.printStackTrace();

            // 에러 응답 반환
            JSONData errorResponse = new JSONData();
            errorResponse.setMessage("댓글 목록 조회에 실패하였습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/delete/{seq}")
    public ResponseEntity<JSONData> deleteComment(@PathVariable("seq") Long seq) {
        // 댓글 삭제 작업 수행
        BoardData boardData = deleteService.delete(seq);

        // 보드데이터의 댓글 수 업데이트
        infoService.updateCommentCnt(boardData.getSeq());

        JSONData responseData = new JSONData();
        responseData.setData(boardData);
        responseData.setMessage("게시글 삭제 성공");
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
