package com.aicodegem.service;

import com.aicodegem.model.UserCodeStyle;
import com.aicodegem.repository.UserCodeStyleRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserCodeStyleService {
    private final UserCodeStyleRepository userCodeStyleRepository;

    public UserCodeStyleService(UserCodeStyleRepository userCodeStyleRepository) {
        this.userCodeStyleRepository = userCodeStyleRepository;
    }

    public Optional<UserCodeStyle> getUserCodeStyle(Long userId) {
        return userCodeStyleRepository.findByUserId(userId);
    }

    public UserCodeStyle saveOrUpdateUserCodeStyle(UserCodeStyle userCodeStyle) {
        return userCodeStyleRepository.save(userCodeStyle);
    }
}