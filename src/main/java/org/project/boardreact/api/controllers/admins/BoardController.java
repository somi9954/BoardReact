package org.project.boardreact.api.controllers.admins;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.project.boardreact.commons.ListData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.rests.JSONData;
import org.project.boardreact.entities.Board;
import org.project.boardreact.models.board.config.BoardConfigDeleteService;
import org.project.boardreact.models.board.config.BoardConfigInfoService;
import org.project.boardreact.models.board.config.BoardConfigSaveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController("adminBoardController")
@RequestMapping("/api/v1/admin/board")
@RequiredArgsConstructor
public class BoardController {

    private static final Logger logger = LoggerFactory.getLogger(BoardController.class);

    private final BoardConfigSaveService saveService;
    private final BoardConfigInfoService infoService;
    private final BoardConfigDeleteService deleteService;
    private final BoardConfigValidator validator;


    @GetMapping("/list")
    public ResponseEntity<ListData<Board>> list(@ModelAttribute BoardSearch search) {
        try {
            ListData<Board> boardList = infoService.getList(search);
            return ResponseEntity.ok(boardList);
        } catch (Exception e) {
            logger.error("Error occurred while fetching board list: {}", e.getMessage(), e);
            JSONData<List<Board>> errorResponse = new JSONData<>();
            errorResponse.setMessage("Failed to fetch board list");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ListData<>());
        }
    }


    @PutMapping("/update")
    public ResponseEntity<JSONData> updateList(@RequestParam List<Integer> idxes) throws BadRequestException {
        try {
            logger.info("Received request to update boards with indexes: {}", idxes);
            saveService.update(idxes);
            JSONData response = new JSONData<>();
            response.setMessage("Updated successfully");
            return ResponseEntity.status(response.getStatus()).body(response);
        } catch (Exception e) {
            logger.error("Error occurred while updating boards: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<JSONData> deleteList(@RequestParam("idxes") String idxes) throws BadRequestException {
        // 클라이언트가 idxes를 쿼리 문자열로 전송하므로 이를 받아서 처리합니다.
        // idxes를 콤마(,)로 분리하여 리스트로 변환합니다.
        List<Integer> idxList = Arrays.stream(idxes.split(","))
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        System.out.println("Received delete request for indices: " + idxList);

        // 여기서 idxList가 올바른지 확인할 수 있습니다.
        // 예를 들어, 다음과 같이 각 인덱스를 반복하여 프린트할 수 있습니다.
        for (Integer idx : idxList) {
            System.out.println("Index to delete: " + idx);
        }

        deleteService.delete(idxList);

        JSONData responseData = new JSONData();
        responseData.setMessage("게시글이 성공적으로 삭제되었습니다.");

        System.out.println("Deletion completed successfully.");

        return ResponseEntity.ok().body(responseData);
    }


    @PutMapping("/edit/{bId}")
    public ResponseEntity<JSONData> update(@PathVariable("bId") String bId, @RequestBody BoardConfigForm form) {
        try {
            // 게시판 ID로 게시판 정보를 가져옴
            BoardConfigForm originalForm = infoService.getForm(bId);
            System.out.println("수정 전 게시판 정보:" + originalForm);

            // 클라이언트가 보낸 요청의 컨텐츠를 확인하여 올바른 데이터가 포함되어 있는지 확인합니다.
            System.out.println("수정된 게시판 폼 데이터:" + form);

            // 수정된 데이터를 저장
            form.setbId(bId); // 폼 데이터에 게시판 ID를 설정
            saveService.save(form);

            JSONData data = new JSONData();
            data.setMessage("게시판이 성공적으로 수정되었습니다.");
            return ResponseEntity.ok().body(data);
        } catch (Exception e) {
            logger.error("게시판 수정 중 오류 발생: {}", e.getMessage(), e);
            JSONData data = new JSONData();
            data.setMessage("게시판 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(data);
        }
    }

    @PostMapping("/add")
    public ResponseEntity save( @RequestBody  BoardConfigForm form, Errors errors)  {
        validator.validate(form, errors);

        errorProcess(errors);

        saveService.save(form);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{bid}")
    public ResponseEntity<JSONData> delete(@PathVariable("bid") String bid, HttpServletRequest request) {
        // 클라이언트로부터의 요청 데이터 출력
        System.out.println("요청 방식: " + request.getMethod());
        System.out.println("요청 URL: " + request.getRequestURI());
        System.out.println("게시글 ID: " + bid);

        // 게시글 삭제 로직 실행
        deleteService.delete(bid);

        JSONData responseData = new JSONData();
        responseData.setMessage("게시글이 성공적으로 삭제되었습니다.");
        return ResponseEntity.ok().body(responseData);
    }

    private void errorProcess(Errors errors) {
        if (errors.hasErrors()) {
            throw new org.project.boardreact.commons.exceptions.BadRequestException(Utils.getMessages(errors));
        }
    }
}
