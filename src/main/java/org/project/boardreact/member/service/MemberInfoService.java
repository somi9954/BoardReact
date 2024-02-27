package org.project.boardreact.member.service;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.member.constants.Authority;
import org.project.boardreact.member.entities.Member;
import org.project.boardreact.member.repositories.MemberRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MemberInfoService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Member member = memberRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));

        Authority authority = Objects.requireNonNullElse(member.getAuthority(), Authority.USER);

        List<GrantedAuthority> authorities = Arrays.asList(
                new SimpleGrantedAuthority(authority.name())
        );

        return MemberInfo.builder()
                .email(member.getEmail())
                .password(member.getPassword())
                .enable(member.isEnable())
                .lock(member.isLock())
                .authorities(authorities)
                .member(member)
                .build();
    }
}
