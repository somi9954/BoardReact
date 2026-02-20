package org.project.boardreact.repositories;

import org.project.boardreact.entities.Member;
import org.project.boardreact.entities.QMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long>, QuerydslPredicateExecutor<Member> {
    Member save(Member member);

    @Query("SELECT m FROM Member m WHERE m.email = :id AND m.deleted = false")
    Optional<Member> findById(@Param("id") String id);

    Optional<Member> findByEmailAndDeletedFalse(String email);
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByMobile(String mobile);

    default boolean exists(String email) {
        return exists(QMember.member.email.eq(email).and(QMember.member.deleted.isFalse()));
    }

    List<Member> findAllByDeletedFalseOrderByCreatedAtDesc();

    List<Member> findAllByDeletedTrueAndDeletedAtBefore(LocalDateTime baseTime);
}
