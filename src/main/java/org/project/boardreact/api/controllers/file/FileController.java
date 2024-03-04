package org.project.boardreact.api.controllers.file;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.commons.rests.JSONData;
import org.project.boardreact.entities.FileInfo;
import org.project.boardreact.models.file.FileDeleteService;
import org.project.boardreact.models.file.FileDownloadService;
import org.project.boardreact.models.file.FileInfoService;
import org.project.boardreact.models.file.FileUploadService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller("frontFileController")
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final FileDeleteService deleteService;
    private final FileUploadService uploadService;
    private final FileDownloadService downloadService;
    private final FileInfoService infoService;

    // 파일 업로드
    @PostMapping
    public JSONData upload(RequestFileUpload form) {

        List<FileInfo> items = uploadService.upload(form.getFile());

        return new JSONData(items);
    }

    // 파일 삭제
    @DeleteMapping
    public void delete(RequestFileDelete form) {
        Long seq = form.getSeq();
        String gid = form.getGid();
        String location = form.getLocation();

        if (seq != null) {
            deleteService.delete(seq);
        } else if (StringUtils.hasText(gid)) {
            deleteService.delete(gid, location);
        }
    }
    @GetMapping("/download/{seq}")
    public void download(@PathVariable("seq") Long seq) {
        downloadService.download(seq);
    }

    @GetMapping("/{seq}")
    public JSONData info(@PathVariable("seq") Long seq) {
        FileInfo item = infoService.get(seq);

        return new JSONData(item);
    }

    @GetMapping
    public JSONData list(@RequestParam("gid") String gid,
                         @RequestParam(name = "location", required = false) String location,
                         @RequestParam(name = "mode", required = false) String mode) {

        List<FileInfo> items = StringUtils.hasText(mode) ? infoService.getList(gid, location, mode) : infoService.getListDone(gid, location);

        return new JSONData(items);
    }
}