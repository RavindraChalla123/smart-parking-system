package com.smartparking.smart_parking_backend.service;

import com.smartparking.smart_parking_backend.model.User;
import com.smartparking.smart_parking_backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository repository) {
        this.repository = repository;
    }

    public User register(String name, String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();
        if (repository.findByEmail(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        User user = new User(name.trim(), normalizedEmail, encoder.encode(password), "USER");
        return repository.save(user);
    }

    public User login(String email, String password) {
        User user = repository.findByEmail(email.trim().toLowerCase()).orElse(null);
        if (user == null || !matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        // Upgrade legacy plain-text passwords when a user successfully logs in.
        if (!isBcrypt(user.getPassword())) {
            user.setPassword(encoder.encode(password));
            repository.save(user);
        }
        return user;
    }

    private boolean matches(String raw, String stored) {
        if (stored == null) return false;
        return isBcrypt(stored) ? encoder.matches(raw, stored) : stored.equals(raw);
    }

    private boolean isBcrypt(String value) {
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }
}
