package org.project.boardreact.api.controllers.admins;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.project.boardreact.commons.rests.JSONData;
import org.project.boardreact.entities.Board;
import org.project.boardreact.models.board.config.BoardConfigDeleteService;
import org.project.boardreact.models.board.config.BoardConfigInfoService;
import org.project.boardreact.models.board.config.BoardConfigSaveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController("adminBoardController")
@RequestMapping("/api/v1/admin/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardConfigSaveService saveService;
    private final BoardConfigInfoService infoService;
    private final BoardConfigDeleteService deleteService;

    @GetMapping
    public ResponseEntity<JSONData<List<Board>>> list(@RequestParam(required = false) BoardSearch search) {
        List<Board> boards = infoService.getList(search).getContent();
        JSONData<List<Board>> response = new JSONData<>(boards);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PatchMapping("/update")
    public ResponseEntity<JSONData> updateList(@RequestParam List<Integer> idxes) throws BadRequestException {
        saveService.update(idxes);
        JSONData<?> response = new JSONData<>();
        response.setMessage("Updated successfully");
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<JSONData> deleteList(@RequestParam List<Integer> idxes) throws BadRequestException {
        deleteService.delete(idxes);
        JSONData<?> response = new JSONData<>();
        response.setMessage("Deleted successfully");
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/add")
    public ResponseEntity<JSONData> register(@RequestBody BoardConfigForm form) {
        saveService.save(form);
        JSONData<?> response = new JSONData<>();
        response.setMessage("Added successfully");
        response.setStatus(HttpStatus.CREATED);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/edit/{bId}")
    public ResponseEntity<JSONData> update(@PathVariable("bId") String bId, @RequestBody BoardConfigForm form) {
        infoService.getForm(bId);
        JSONData response = new JSONData<>();
        response.setMessage("Updated successfully");
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/save")
    public ResponseEntity<JSONData<Void>> saveBoardConfig(@Valid @RequestBody BoardConfigForm form) {
        JSONData<Void> responseData = new JSONData<>();
        try {
            String mode = Objects.requireNonNullElse(form.getMode(), "add");
            saveService.save(form);
            responseData.setMessage("Board config saved successfully");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setSuccess(false);
            responseData.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            responseData.setMessage("Error saving board config: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
        }
    }
}
