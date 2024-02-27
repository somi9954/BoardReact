package org.project.boardreact.member.service;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.member.constants.Authority;
import org.project.boardreact.member.controllers.RequestJoin;
import org.project.boardreact.member.entities.Member;
import org.project.boardreact.member.repositories.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberSaveService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder encoder;

    public void join(RequestJoin form) {

        String hash = encoder.encode(form.getPassword());

        Member member = Member.builder()
                .email(form.getEmail())
                .name(form.getName())
                .password(hash)
                .mobile(form.getMobile())
                .authority(Authority.USER)
                .lock(false)
                .enable(true)
                .build();

        save(member);
    }

    public void save(Member member) {
        String mobile = member.getMobile();
        if (member != null) {
            mobile = mobile.replaceAll("\\D", "");
            member.setMobile(mobile);
        }

        memberRepository.saveAndFlush(member);
    }

}
