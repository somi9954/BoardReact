package org.project.boardreact.member.service;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.jwt.TokenProvider;
import org.project.boardreact.member.controllers.RequestLogin;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberLoginService {
    private final TokenProvider tokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    public String login(RequestLogin form) {

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(new UsernamePasswordAuthenticationToken(form.getEmail(), form.getPassword()));

        String accessToken = tokenProvider.createToken(authentication);

        return accessToken;
    }

}
