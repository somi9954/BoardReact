package org.project.boardreact.models.member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.boardreact.entities.BoardData;
import org.project.boardreact.entities.Member;
import org.project.boardreact.repositories.BoardDataRepository;
import org.project.boardreact.repositories.CommentDataRepository;
import org.project.boardreact.repositories.MemberRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class MemberCleanupScheduler {

    private final MemberRepository memberRepository;
    private final BoardDataRepository boardDataRepository;
    private final CommentDataRepository commentDataRepository;

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupWithdrawnMembers() {
        LocalDateTime baseTime = LocalDateTime.now().minusDays(30);
        List<Member> targets = memberRepository.findAllByDeletedTrueAndDeletedAtBefore(baseTime);

        if (targets.isEmpty()) {
            return;
        }

        for (Member member : targets) {
            deleteMemberRelatedData(member);
            memberRepository.delete(member);
        }

        log.info("Deleted {} withdrawn members permanently.", targets.size());
    }

    private void deleteMemberRelatedData(Member member) {
        List<BoardData> boardDataList = boardDataRepository.findAllByMember(member);
        if (!boardDataList.isEmpty()) {
            commentDataRepository.deleteAllByBoardDataIn(boardDataList);
            boardDataRepository.deleteAll(boardDataList);
        }

        commentDataRepository.deleteAll(commentDataRepository.findAllByMember(member));
    }
}
