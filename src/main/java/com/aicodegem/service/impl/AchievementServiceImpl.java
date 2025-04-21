package com.aicodegem.service.impl;

import com.aicodegem.model.Achievement;
import com.aicodegem.model.User;
import com.aicodegem.model.UserAchievement;
import com.aicodegem.repository.AchievementRepository;
import com.aicodegem.repository.RankingRepository;
import com.aicodegem.repository.UserAchievementRepository;
import com.aicodegem.repository.UserRepository;
import com.aicodegem.service.AchievementService;
import com.aicodegem.service.UserAchievementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;

@Service
public class AchievementServiceImpl implements AchievementService {

    private static final Logger logger = LoggerFactory.getLogger(AchievementServiceImpl.class);

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private RankingRepository rankingRepository;

    @Autowired
    private UserAchievementService userAchievementService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Achievement> getAllAchievements() {
        List<Achievement> achievements = achievementRepository.findAll();
        if (achievements.isEmpty()) {
            logger.warn("업적 목록이 비어 있습니다.");
            throw new RuntimeException("업적이 없습니다.");
        }
        return achievements;
    }

    @Override
    public Achievement getAchievementById(Long achievementId) { // 업적 id 바탕으로 업적 출력
        return achievementRepository.findById(achievementId)
                .orElseThrow(() -> new IllegalArgumentException("Achievement not found: " + achievementId));
    }

    @Override
    public void assignAchievementsByTotalScore(Long userId) { // 누적 점수 업적들의 조건 부합시 사용자에게 업적을 부여
        logger.info("사용자 ID {}의 누적 점수 기반으로 업적을 확인합니다.", userId);

        int totalScore = rankingRepository.findByUser_Id(userId) // 누적 점수 추출
                .map(ranking -> ranking.getTotalScore())
                .orElseThrow(() -> new IllegalArgumentException("사용자의 랭킹 정보가 없습니다."));

        logger.info("사용자의 누적 점수: {}", totalScore);

        List<Achievement> achievements = this.getAllAchievements(); // list 형태로 업적 목록 반환

        User user = userRepository.findById(userId) // 사용자 id바탕으로 사용자 반환
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        for (Achievement achievement : achievements) { // 업적 목록 순회
            if (evaluateCriteria(achievement.getCriteria(), totalScore)) { // 조건에 누적점수가 포함되는지 확인
                boolean alreadyAssigned = userAchievementService.isAchievementAlreadyAssigned(userId,
                        achievement.getId());
                if (!alreadyAssigned) { // 누적 점수가 업데이트 되지 않았을 경우
                    UserAchievement userAchievement = new UserAchievement();
                    userAchievement.setUser(user);
                    userAchievement.setAchievement(achievement);
                    userAchievement.setDateAchieved(LocalDate.now());
                    userAchievementService.assignAchievementToUser(userAchievement);

                    logger.info("새로운 업적 '{}'이 사용자 {}에게 할당되었습니다.", achievement.getAchievementName(), userId);
                }
            }
        }
    }

    private boolean evaluateCriteria(String criteria, int totalScore) { // 조건에 totalScore가 포함되어있는지 확인
        if (criteria == null || criteria.isEmpty()) {
            return false; // 또는 적절한 기본값을 반환할 수 있습니다.
        }
        if (criteria.contains("total_score >= ")) {
            int requiredScore = Integer.parseInt(criteria.split(">= ")[1]);
            return totalScore >= requiredScore;
        }
        return false;
    }

    @Override
    public UserAchievement saveUserAchievement(UserAchievement userAchievement) {
        return userAchievementRepository.save(userAchievement); // UserAchievement 저장
    }

    @Override
    public Achievement saveAchievement(Achievement achievement) {
        return achievementRepository.save(achievement); // Achievement 저장
    }
}
