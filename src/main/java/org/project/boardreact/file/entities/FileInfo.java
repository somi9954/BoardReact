package org.project.boardreact.file.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.boardreact.commons.entities.BaseMember;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
@Builder
@Entity
@NoArgsConstructor @AllArgsConstructor
@Table(indexes = {
        @Index(name="idx_fi_gid", columnList = "gid, createdAt"),
        @Index(name="idx_fi_gid_location", columnList = "gid, location, createdAt")
})
public class FileInfo extends BaseMember {
    @Id @GeneratedValue
    private Long seq;

    @Column(length=65, nullable = false)
    private String gid = UUID.randomUUID().toString();

    @Column(length=65)
    private String location;

    @Column(length=80, nullable = false)
    private String fileName;

    @Column(length=45)
    private String extension;

    @Column(length=65)
    private String contentType;

    private boolean done;

    @Transient
    private String filePath;

    @Transient
    private String fileUrl;

    @Transient
    private MultipartFile file;
}
