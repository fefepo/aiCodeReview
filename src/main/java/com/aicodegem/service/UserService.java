
package com.aicodegem.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.aicodegem.model.User;
import com.aicodegem.repository.UserRepository;
import com.aicodegem.dto.UserDTO;
import java.util.ArrayList;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                new ArrayList<>());
    }

    // 유저 등록 로직
    public String registerUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalStateException("Username already taken.");
        }

        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        User newUser = new User();
        newUser.setUsername(userDTO.getUsername());
        newUser.setPassword(encodedPassword);
        newUser.setEmail(userDTO.getEmail());
        newUser.setPhoneNum(userDTO.getPhoneNum());

        userRepository.save(newUser);
        return "User registered successfully";
    }
}
