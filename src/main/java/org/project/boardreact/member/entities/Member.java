package org.project.boardreact.member.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.boardreact.commons.entities.Base;
import org.project.boardreact.member.constants.Authority;

@Data
@Builder
@Entity
@NoArgsConstructor @AllArgsConstructor
public class Member extends Base {
    @Id @GeneratedValue
    private Long seq;

    @Column(length=80, unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(length=65, nullable = false)
    private String password;

    @Column(length=40, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length=10, nullable = false)
    private Authority authority = Authority.USER;

    @Column(name="_lock")
    private boolean lock;
    private boolean enable;
}
