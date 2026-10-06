package com.smartparking.smart_parking_backend.service;


import org.springframework.stereotype.Service;

import com.smartparking.smart_parking_backend.model.User;
import com.smartparking.smart_parking_backend.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public User addUser(User user) {
        return repository.save(user);
    }

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public User getUserById(Long id) {
        return repository.findById(id).orElse(null);
    }
}