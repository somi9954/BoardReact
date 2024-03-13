package org.project.boardreact.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.project.boardreact.commons.contansts.BoardAuthority;


@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Board extends BaseMember {

    @Id
    @Column(length=30)
    private String bId;

    @Column(length=60, nullable = false, updatable = false)
    private String bName;

    private boolean active;

    @Enumerated(EnumType.STRING)
    @Column(length=10, nullable = false)
    private BoardAuthority authority = BoardAuthority.ALL;

    @Lob
    private String category;
}