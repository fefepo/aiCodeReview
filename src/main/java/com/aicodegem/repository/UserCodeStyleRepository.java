package com.aicodegem.repository;

import com.aicodegem.model.UserCodeStyle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserCodeStyleRepository extends JpaRepository<UserCodeStyle, Long> {
    Optional<UserCodeStyle> findByUserId(Long userId);
}