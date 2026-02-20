package org.project.boardreact.api.controllers.admins;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.commons.configs.ConfigInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/config")
@RequiredArgsConstructor
public class PublicConfigController {

    private final ConfigInfoService infoService;

    @GetMapping("/public")
    public ResponseEntity<ConfigForm> getPublicConfig() {
        ConfigForm form = infoService.get("config", ConfigForm.class);
        form = form == null ? new ConfigForm() : form;

        ConfigForm response = new ConfigForm();
        response.setSiteTitle(form.getSiteTitle());
        response.setSiteDescription(form.getSiteDescription());
        response.setJoinTerms(form.getJoinTerms());

        return ResponseEntity.ok(response);
    }
}
