package org.project.boardreact.api.controllers.members;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.contansts.MemberType;
import org.project.boardreact.commons.exceptions.BadRequestException;
import org.project.boardreact.commons.rests.JSONData;
import org.project.boardreact.entities.FileInfo;
import org.project.boardreact.entities.Member;
import org.project.boardreact.models.member.MemberInfo;
import org.project.boardreact.models.member.MemberLoginService;
import org.project.boardreact.models.file.FileUploadService;
import org.project.boardreact.models.member.MemberSaveService;
import org.project.boardreact.repositories.MemberRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberSaveService saveService;
    private final MemberLoginService loginService;
    private final MemberRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final FileUploadService fileUploadService;

    @PostMapping
    public ResponseEntity<JSONData> join(@RequestBody @Valid RequestJoin form, Errors errors) {
        saveService.save(form, errors);

        errorProcess(errors);

        JSONData data = new JSONData();
        data.setStatus(HttpStatus.CREATED);

        return ResponseEntity.status(data.getStatus()).body(data);
    }

    @PostMapping("/token")
    public ResponseEntity<JSONData> token(@RequestBody @Valid RequestLogin form, Errors errors) {
        errorProcess(errors);

        String accessToken = loginService.login(form);

        JSONData data = new JSONData(accessToken);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        return ResponseEntity.status(data.getStatus()).headers(headers).body(data);
    }


    @GetMapping("/info")
    public JSONData info(@AuthenticationPrincipal MemberInfo memberInfo) {
        Member member = memberInfo.getMember();

        return new JSONData(member);
    }

    @PatchMapping("/mypage")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<JSONData> updateMyPage(@AuthenticationPrincipal MemberInfo memberInfo,
                                                 @RequestBody @Valid RequestProfileUpdate form,
                                                 Errors errors) {

        if (StringUtils.hasText(form.password()) && !form.password().equals(form.confirmPassword())) {
            errors.rejectValue("confirmPassword", "Mismatch_confirmPassword", "비밀번호가 일치하지 않습니다.");
        }

        errorProcess(errors);

        Member member = memberInfo.getMember();

        if (StringUtils.hasText(form.nickname())) {
            member.setNickname(form.nickname());
        }

        if (form.mobile() != null) {
            member.setMobile(form.mobile());
        }

        if (StringUtils.hasText(form.password())) {
            member.setPassword(passwordEncoder.encode(form.password()));
        }

        if (StringUtils.hasText(form.profileImage())) {
            member.setProfileImage(form.profileImage());
        }

        saveService.save(member);

        JSONData data = new JSONData(member);
        data.setMessage("회원정보가 수정되었습니다.");

        return ResponseEntity.ok(data);
    }


    @PostMapping(value = "/mypage/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<JSONData> uploadProfileImage(@AuthenticationPrincipal MemberInfo memberInfo,
                                                       @RequestParam(name = "file", required = false) MultipartFile file,
                                                       @RequestParam(name = "profileImage", required = false) MultipartFile profileImage) {
        file = file != null ? file : profileImage;

        if (file == null || file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new BadRequestException(Map.of("file", List.of("이미지 파일만 업로드할 수 있습니다.")));
        }

        List<FileInfo> uploaded = fileUploadService.upload(new MultipartFile[]{file}, null, "profile");
        if (uploaded.isEmpty()) {
            throw new BadRequestException(Map.of("file", List.of("프로필 이미지를 업로드하지 못했습니다.")));
        }

        FileInfo item = uploaded.get(0);
        Member member = memberInfo.getMember();
        member.setProfileImage(item.getFileUrl());
        saveService.save(member);

        JSONData data = new JSONData(member);
        data.setMessage("프로필 이미지가 변경되었습니다.");

        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/mypage")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<JSONData> deleteMyPage(@AuthenticationPrincipal MemberInfo memberInfo) {
        Member member = memberInfo.getMember();
        softDeleteMember(member);

        JSONData data = new JSONData(true);
        data.setMessage("회원 탈퇴가 완료되었습니다. 30일 후 완전 삭제됩니다.");
        return ResponseEntity.ok(data);
    }


    @GetMapping("/admin/memberList")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<JSONData> getAllMembers() {
        try {
            List<Member> members = repository.findAll();
            log.info("Number of members: {}", members.size());

            JSONData data = new JSONData(members);
            data.setStatus(HttpStatus.OK);

            return ResponseEntity.status(data.getStatus()).body(data);
        } catch (Exception e) {
            log.error("Error fetching members: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String admin() {
        return "관리자 페이지 접속....";
    }

    @PatchMapping({"/admin/{userNo}/type", "/admin/type"})
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<JSONData> updateMemberType(@PathVariable(name = "userNo", required = false) Long pathUserNo,
                                                     @RequestParam(name = "userNo", required = false) Long queryUserNo,
                                                     @AuthenticationPrincipal MemberInfo memberInfo,
                                                     @RequestBody Map<String, String> params) {
        Long userNo = pathUserNo != null ? pathUserNo : queryUserNo;
        if (userNo == null) {
            throw new BadRequestException(Map.of("userNo", List.of("회원 번호가 필요합니다.")));
        }

        Member loginMember = memberInfo.getMember();
        if (loginMember.getUserNo().equals(userNo)) {
            throw new BadRequestException(Map.of("userNo", List.of("본인 계정의 권한은 변경할 수 없습니다.")));
        }

        Member member = repository.findById(userNo).orElseThrow(() -> new BadRequestException(Map.of("userNo", List.of("회원 정보를 찾을 수 없습니다."))));

        String type = params.get("type");
        if (type == null) {
            throw new BadRequestException(Map.of("type", List.of("변경할 회원 타입이 필요합니다.")));
        }

        member.setType(MemberType.valueOf(type));
        repository.saveAndFlush(member);

        JSONData data = new JSONData(member);
        data.setMessage("회원 권한이 변경되었습니다.");
        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/admin/{userNo}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public ResponseEntity<JSONData> deleteMember(@PathVariable("userNo") Long userNo, @AuthenticationPrincipal MemberInfo memberInfo) {
        Member loginMember = memberInfo.getMember();
        if (loginMember.getUserNo().equals(userNo)) {
            throw new BadRequestException(Map.of("userNo", List.of("본인 계정은 삭제할 수 없습니다.")));
        }

        Member member = repository.findById(userNo).orElseThrow(() -> new BadRequestException(Map.of("userNo", List.of("회원 정보를 찾을 수 없습니다."))));
        softDeleteMember(member);

        JSONData data = new JSONData(true);
        data.setMessage("회원이 탈퇴 처리되었습니다. 30일 후 완전 삭제됩니다.");
        return ResponseEntity.ok(data);
    }

    private void softDeleteMember(Member member) {
        member.setDeleted(true);
        member.setDeletedAt(LocalDateTime.now());
        repository.saveAndFlush(member);
    }

    private void errorProcess(Errors errors) {
        if (errors.hasErrors()) {
            throw new BadRequestException(Utils.getMessages(errors));
        }
    }
}
