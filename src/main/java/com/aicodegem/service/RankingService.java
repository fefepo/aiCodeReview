package com.aicodegem.service;

import com.aicodegem.model.Ranking;
import java.util.List;

public interface RankingService {
    /** 사용자 ID로 순위 조회 */
    Ranking getRankingByUserId(Long userId);

    /** 순위 저장 */
    Ranking saveRanking(Ranking ranking);

    /** 모든 랭킹 정보 조회 */
    List<Ranking> getAllRankings();

    /** 사용자 순위의 총점수 업데이트 */
    void updateTotalScore(Long userId, int newScore);

    void processSuccessfulSubmissions();
}
