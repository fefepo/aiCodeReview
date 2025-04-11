package com.aicodegem.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aicodegem.model.Ranking;
import com.aicodegem.repository.RankingRepository;

// RankingService 인터페이스의 구현 클래스
@Service
public class RankingServiceImpl implements RankingService {

    private static final Logger logger = LoggerFactory.getLogger(RankingServiceImpl.class);

    @Autowired
    private RankingRepository rankingRepository; // RankingRepository 의존성 주입

    @Override
    public Ranking getRankingByUserId(Long userId) {
        logger.info("사용자 ID {}로 순위 조회 요청을 받았습니다.", userId);
        Ranking ranking = rankingRepository.findByUser_Id(userId).orElse(null); // 사용자 ID로 순위 조회

        if (ranking != null) { // 순위가 있는지 확인
            logger.info("순위 조회 성공 - 사용자 ID: {}, 순위: {}", userId, ranking.getUserRank());
        } else {
            logger.warn("순위 조회 실패 - 사용자 ID {}에 대한 순위가 없습니다.", userId);
        }

        return ranking;
    }

    @Override
    public Ranking saveRanking(Ranking ranking) { // 사용자 순위 저장
        logger.info("새 순위를 저장합니다 - 사용자 ID: {}, 순위: {}", ranking.getUser().getId(), ranking.getUserRank());
        Ranking savedRanking = rankingRepository.save(ranking); // 순위 저장
        logger.info("순위 저장 성공 - ID: {}", savedRanking.getId());

        return savedRanking;
    }

    @Override
    public List<Ranking> getAllRankings() { // 전체 순위 조회
        logger.info("모든 랭킹 정보를 조회합니다.");
        List<Ranking> rankings = rankingRepository.findAll(); // 모든 랭킹 정보 조회
        logger.info("총 {}개의 랭킹 정보를 조회했습니다.", rankings.size());

        return rankings;
    }

    // 점수를 업데이트하는 메서드
    @Override
    public void updateTotalScore(Long userId, int newScore) {
        try {
            // Ranking을 찾기 위한 Optional 처리
            Optional<Ranking> rankingOpt = rankingRepository.findByUser_Id(userId);

            if (rankingOpt.isPresent()) {
                Ranking ranking = rankingOpt.get();
                int currentTotalScore = ranking.getTotalScore();
                ranking.setTotalScore(currentTotalScore + newScore); // 최신 점수를 기존 totalScore에 추가

                rankingRepository.save(ranking); // 업데이트된 totalScore 저장
            } else {
                // 해당 사용자가 없을 경우 예외를 던짐
                throw new RuntimeException("사용자가 없습니다.");
            }
        } catch (Exception e) {
            // 예외 발생 시 로그를 찍고, 예외 메시지를 반환
            logger.error("점수 업데이트 중 오류 발생: {}", e.getMessage()); // 로그에 오류 메시지 출력
            throw new RuntimeException("점수 업데이트 중 오류 발생: " + e.getMessage()); // 호출한 곳에 예외 던짐
        }
    }

}
