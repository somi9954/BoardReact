package org.project.boardreact.repositories;

import org.project.boardreact.entities.BoardData;
import org.project.boardreact.entities.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;

public interface BoardDataRepository extends JpaRepository<BoardData, Long>, QuerydslPredicateExecutor<BoardData> {
    List<BoardData> findAllByMember(Member member);

    long countByMember(Member member);

    void deleteAllByMember(Member member);
}
