package org.project.boardreact.models.member;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.api.controllers.members.JoinValidator;
import org.project.boardreact.api.controllers.members.RequestJoin;
import org.project.boardreact.commons.contansts.BoardAuthority;
import org.project.boardreact.commons.contansts.MemberType;
import org.project.boardreact.commons.exceptions.BadRequestException;
import org.project.boardreact.configs.jwt.CustomJwtFilter;
import org.project.boardreact.configs.jwt.TokenProvider;
import org.project.boardreact.entities.Member;
import org.project.boardreact.repositories.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberSaveService {
    private final MemberRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JoinValidator joinValidator;
    private final CustomJwtFilter customJwtFilter;
    private final TokenProvider tokenProvider;

    public void save(RequestJoin form, Errors errors) {
        joinValidator.validate(form, errors);

        if (errors.hasErrors()) {
            return;
        }

        // 회원 가입 처리
        String hash = passwordEncoder.encode(form.password());
        Member member = Member.builder()
                .email(form.email())
                .nickname(form.name())
                .password(hash)
                .mobile(form.mobile())
                .type(MemberType.USER)
                .boardAuthority(BoardAuthority.USER)
                .build();

        save(member);
    }


    public void save(Member member) {
        String mobile = member.getMobile();
        if (member != null) {
            mobile = mobile.replaceAll("\\D", "");
            member.setMobile(mobile);
        }

        repository.saveAndFlush(member);
    }
}
