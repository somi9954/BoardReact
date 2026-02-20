package org.project.boardreact.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.boardreact.api.controllers.members.RequestJoin;
import org.project.boardreact.commons.contansts.BoardAuthority;
import org.project.boardreact.commons.contansts.MemberType;

import java.time.LocalDateTime;

@Entity
@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class Member extends Base{

    @Id @GeneratedValue
    private Long userNo;

    @Column(length = 65, unique = true, nullable = false)
    private String email;

    @Column(length = 65, nullable = false)
    private String password;

    @Column(length = 40, nullable = false)
    private String nickname;

    @Column(length = 11)
    private String mobile;

    @Enumerated(EnumType.STRING)
    @Column(length = 15, nullable = false)
    private MemberType type = MemberType.USER;

    @Enumerated(EnumType.STRING)
    @Column(length = 15, nullable = false)
    private BoardAuthority boardAuthority = BoardAuthority.USER;

    @Column(nullable = false)
    private boolean deleted = false;

    private LocalDateTime deletedAt;

    public static Member toMember(RequestJoin join) {
         Member member = new Member();
         member.setEmail(join.email());
         member.setPassword(join.password());
         member.setNickname(join.name());
         member.setMobile(join.mobile());
         return member;
    }

}
