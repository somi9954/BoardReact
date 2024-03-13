package org.project.boardreact.api.controllers.admins;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
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

import java.util.List;
import java.util.Objects;

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

    @GetMapping
    public ResponseEntity<JSONData<List<Board>>> list(@RequestParam(required = false) BoardSearch search) {
        List<Board> boards = infoService.getList(search).getContent();
        JSONData<List<Board>> response = new JSONData<>(boards);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/update")
    public ResponseEntity<JSONData> updateList(@RequestParam List<Integer> idxes) throws BadRequestException {
        try {
            logger.info("Received request to update boards with indexes: {}", idxes);
            saveService.update(idxes);
            JSONData<?> response = new JSONData<>();
            response.setMessage("Updated successfully");
            return ResponseEntity.status(response.getStatus()).body(response);
        } catch (Exception e) {
            logger.error("Error occurred while updating boards: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<JSONData> deleteList(@RequestParam List<Integer> idxes) throws BadRequestException {
        deleteService.delete(idxes);
        JSONData<?> response = new JSONData<>();
        response.setMessage("Deleted successfully");
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    @PutMapping("/edit/{bId}")
    public ResponseEntity<JSONData> update(@PathVariable("bId") String bId, @RequestBody BoardConfigForm form) {
            infoService.getForm(bId);
            JSONData response = new JSONData<>();

            return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/add")
    public ResponseEntity save( @RequestBody  BoardConfigForm form, Errors errors)  {
        validator.validate(form, errors);

        errorProcess(errors);

        saveService.save(form);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{bid}")
    public void delete(@PathVariable("bid") String bid) {
        deleteService.delete(bid);
    }

    private void errorProcess(Errors errors) {
        if (errors.hasErrors()) {
            throw new org.project.boardreact.commons.exceptions.BadRequestException(Utils.getMessages(errors));
        }
    }
}
