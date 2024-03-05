package org.project.boardreact.api.controllers.admins;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.configs.ConfigInfoService;
import org.project.boardreact.commons.configs.ConfigSaveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/config")
@RequiredArgsConstructor
public class BasicConfigController {

    private final ConfigSaveService saveService;
    private final ConfigInfoService infoService;

    private String code = "config";

    @GetMapping
    public ResponseEntity<ConfigForm> getConfig() {
        ConfigForm form = infoService.get(code, ConfigForm.class);
        form = form == null ? new ConfigForm() : form;
        return ResponseEntity.ok(form);
    }

    @PostMapping
    public ResponseEntity<String> updateConfig(@RequestBody ConfigForm form) {
        saveService.save(code, form);
        return ResponseEntity.status(HttpStatus.CREATED).body("저장되었습니다.");
    }
}
