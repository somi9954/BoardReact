package org.project.boardreact.repositories;

import org.project.boardreact.entities.Member;
import org.project.boardreact.entities.QMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long>, QuerydslPredicateExecutor<Member> {
    Member save(Member member);

    Optional<Member> findByEmailAndDeletedFalse(String email);
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByMobile(String mobile);

    default boolean exists(String email) {
        return exists(QMember.member.email.eq(email).and(QMember.member.deleted.isFalse()));
    }

    List<Member> findAllByDeletedFalseOrderByCreatedAtDesc();

    List<Member> findAllByDeletedTrueAndDeletedAtBefore(LocalDateTime baseTime);
}
