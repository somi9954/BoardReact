package org.project.boardreact.commons;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.project.boardreact.commons.contansts.MemberType;
import org.project.boardreact.entities.Member;
import org.project.boardreact.models.member.MemberInfo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class MemberUtil {

    private final HttpServletRequest request;

    public boolean isLogin() {
        return getMember() != null;
    }

    public boolean isAdmin() {
        return isLogin() && getMember().getType() == MemberType.ADMIN;
    }

    public Member getMember() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof MemberInfo) {
            MemberInfo memberInfo = (MemberInfo) authentication.getPrincipal();

            return memberInfo.getMember();
        }

        return null;
    }

    /**
     * Authorization: Bearer 토큰값
     * @return
     */
    public String getToken() {
        String authorization = request.getHeader("Authorization");
        if (StringUtils.hasText(authorization)) {
            return authorization.substring(7);
        }

        return null;
    }
}