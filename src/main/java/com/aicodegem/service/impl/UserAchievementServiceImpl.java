package com.aicodegem.service.impl;

import com.aicodegem.model.UserAchievement;
import com.aicodegem.repository.UserAchievementRepository;
import com.aicodegem.service.UserAchievementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Service
public class UserAchievementServiceImpl implements UserAchievementService {

    private static final Logger logger = LoggerFactory.getLogger(AchievementServiceImpl.class);

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Override
    public List<UserAchievement> getAchievementsByUserId(Long userId) {
        List<UserAchievement> userAchievements = userAchievementRepository.findByUser_Id(userId);
        if (userAchievements.isEmpty()) {
            logger.warn("사용자의 업적이 없습니다. userId: {}", userId);
            throw new RuntimeException("사용자 업적이 없습니다.");
        }
        return userAchievements;
    }

    @Override
    public boolean isAchievementAlreadyAssigned(Long userId, Long achievementId) {
        return userAchievementRepository.existsByUser_IdAndAchievement_Id(userId, achievementId);
    }

    @Override
    public UserAchievement assignAchievementToUser(UserAchievement userAchievement) {
        return userAchievementRepository.save(userAchievement);
    }
}
