package com.aicodegem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import com.aicodegem.model.Ranking;
import com.aicodegem.service.RankingService;

// Ranking API를 제공하는 컨트롤러 클래스
@RestController
@RequestMapping("/api/rankings") // 기본 URL 매핑
public class RankingController {

    private static final Logger logger = LoggerFactory.getLogger(RankingController.class); // Logger 생성

    @Autowired
    private RankingService rankingService; // RankingService 의존성 주입

    // 사용자 ID로 순위를 조회하는 GET 요청 처리
    @GetMapping("/{userId}")
    public ResponseEntity<Ranking> getRanking(@PathVariable("userId") Long userId) {
        logger.info("Ranking 조회 요청 - userId: {}", userId);
        Ranking ranking = rankingService.getRankingByUserId(userId); // 순위 조회

        if (ranking != null) {
            logger.info("순위 조회 성공 - userId: {}, 순위:  {}", userId, ranking.getRank()); // 순위 조회 성공 로그
        } else {
            logger.warn("순위 조회 실패 - userId: {}에 해당하는 순위 없음", userId); // 순위 조회 실패 로그
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(ranking); // 성공 응답 반환
    }

    // 순위를 저장하는 POST 요청 처리
    @PostMapping
    public ResponseEntity<Ranking> createRanking(@RequestBody Ranking ranking) {
        logger.info("순위 저장 요청 - userId: {}", ranking.getUserId()); // 순위 저장 요청 로그

        Ranking savedRanking = rankingService.saveRanking(ranking); // 순위 저장
        logger.info("순위 저장 성공 - userId: {}, 저장된 순위: {}", ranking.getUserId(), savedRanking.getRank()); // 순위 저장 성공 로그

        return ResponseEntity.ok(savedRanking); // 성공 응답 반환
    }

    // 모든 랭킹 정보를 조회하는 GET 요청 처리 (점수 갱신 포함)
    @GetMapping
    public ResponseEntity<List<Ranking>> getAllRankings() {
        logger.info("모든 랭킹 조회 요청 - 점수 갱신 포함");

        // 점수 갱신 먼저 수행
        rankingService.processSuccessfulSubmissions();

        // 갱신 후 랭킹 조회
        List<Ranking> rankings = rankingService.getAllRankings();

        logger.info("모든 랭킹 조회 성공, 랭킹 개수: {}", rankings.size());
        return ResponseEntity.ok(rankings); // 성공 응답 반환
    }
}
