package org.project.boardreact.repositories;

import org.project.boardreact.entities.Member;
import org.project.boardreact.entities.QMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long>, QuerydslPredicateExecutor<Member> {
    Member save(Member member);

    Optional<Member> findByEmail(String email);
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByMobile(String mobile);

    default boolean exists(String email) {
        return exists(QMember.member.email.eq(email));
    }
    List<Member> findAll();
}
