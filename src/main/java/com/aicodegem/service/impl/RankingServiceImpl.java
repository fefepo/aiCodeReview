package com.aicodegem.service.impl;

import com.aicodegem.model.Ranking;
import com.aicodegem.model.User;
import com.aicodegem.repository.RankingRepository;
import com.aicodegem.repository.UserRepository;
import com.aicodegem.service.RankingService;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RankingServiceImpl implements RankingService {

    private static final Logger logger = LoggerFactory.getLogger(RankingServiceImpl.class);

    @Autowired
    private RankingRepository rankingRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Ranking getRankingByUserId(Long userId) {
        return rankingRepository.findByUser_Id(userId).orElse(null);
    }

    @Override
    public Ranking saveRanking(Ranking ranking) {
        return rankingRepository.save(ranking);
    }

    @Override
    public List<Ranking> getAllRankings() {
        return rankingRepository.findAll();
    }

    @Override
    public void updateTotalScore(Long userId, int newScore) {
        Optional<Ranking> rankingOpt = rankingRepository.findByUser_Id(userId);

        if (rankingOpt.isPresent()) {
            Ranking ranking = rankingOpt.get();
            ranking.setTotalScore(ranking.getTotalScore() + newScore);
            rankingRepository.save(ranking);
        } else {
            logger.warn("점수 업데이트 실패 - 해당 userId: {}에 대한 Ranking 없음", userId);
        }
    }

    @Override
    public void processSuccessfulSubmissions() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:8080/submissions";

            String json = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();

            List<Map<String, Object>> submissions = mapper.readValue(json, new TypeReference<>() {
            });
            for (Map<String, Object> submission : submissions) {
                String status = (String) submission.get("status");
                String userIdStr = (String) submission.get("userId");
                String problemId = (String) submission.get("problemId"); // ✅ 문제 ID 추출

                if ("Correct".equals(status)) {
                    Optional<User> userOpt = userRepository.findByUsername(userIdStr);
                    if (userOpt.isPresent()) {
                        Long userId = userOpt.get().getId();
                        Optional<Ranking> rankingOpt = rankingRepository.findByUser_Id(userId);

                        Ranking ranking = rankingOpt.orElseGet(() -> {
                            Ranking newRanking = new Ranking();
                            newRanking.setUser(userOpt.get());
                            newRanking.setTotalScore(0);
                            return newRanking;
                        });

                        // ✅ 중복 정답 방지
                        if (ranking.getSolvedProblems().contains(problemId)) {
                            continue;
                        }

                        ranking.setTotalScore(ranking.getTotalScore() + 1);
                        ranking.getSolvedProblems().add(problemId);
                        rankingRepository.save(ranking);
                    } else {
                        logger.warn("userId '{}'에 해당하는 User 없음", userIdStr);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("성공 제출 처리 중 오류: {}", e.getMessage());
        }
    }

}
