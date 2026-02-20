package org.project.boardreact.api.controllers.members;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.project.boardreact.commons.Utils;
import org.project.boardreact.commons.exceptions.BadRequestException;
import org.project.boardreact.commons.rests.JSONData;
import org.project.boardreact.commons.contansts.MemberType;
import org.project.boardreact.entities.Member;
import org.project.boardreact.models.member.MemberInfo;
import org.project.boardreact.models.member.MemberLoginService;
import org.project.boardreact.models.member.MemberSaveService;
import org.project.boardreact.repositories.MemberRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberSaveService saveService;
    private final MemberLoginService loginService;
    private final MemberRepository repository;
    private final PasswordEncoder passwordEncoder;

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

        /**
         * 1. 응답 body - JSONData 형식으로
         * 2. 응답 헤더 - Authorization: Bearer 토큰
         */

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

        saveService.save(member);

        JSONData data = new JSONData(member);
        data.setMessage("회원정보가 수정되었습니다.");

        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/mypage")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<JSONData> deleteMyPage(@AuthenticationPrincipal MemberInfo memberInfo) {
        Member member = memberInfo.getMember();
        repository.delete(member);

        JSONData data = new JSONData(true);
        data.setMessage("회원 탈퇴가 완료되었습니다.");
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

    @PatchMapping("/admin/{userNo}/type")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<JSONData> updateMemberType(@PathVariable Long userNo, @RequestBody Map<String, String> params) {
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
    public ResponseEntity<JSONData> deleteMember(@PathVariable Long userNo, @AuthenticationPrincipal MemberInfo memberInfo) {
        Member loginMember = memberInfo.getMember();
        if (loginMember.getUserNo().equals(userNo)) {
            throw new BadRequestException(Map.of("userNo", List.of("본인 계정은 삭제할 수 없습니다.")));
        }

        Member member = repository.findById(userNo).orElseThrow(() -> new BadRequestException(Map.of("userNo", List.of("회원 정보를 찾을 수 없습니다."))));
        repository.delete(member);

        JSONData data = new JSONData(true);
        data.setMessage("회원이 탈퇴 처리되었습니다.");
        return ResponseEntity.ok(data);
    }

    private void errorProcess(Errors errors) {
        if (errors.hasErrors()) {
            throw new BadRequestException(Utils.getMessages(errors));
        }
    }


}
