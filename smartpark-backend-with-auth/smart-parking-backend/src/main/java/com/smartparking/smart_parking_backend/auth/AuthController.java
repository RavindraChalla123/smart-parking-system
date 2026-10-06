package com.smartparking.smart_parking_backend.auth;

import com.smartparking.smart_parking_backend.model.User;
import com.smartparking.smart_parking_backend.service.AuthService;
import com.smartparking.smart_parking_backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public AuthUser register(@RequestBody RegisterRequest request, HttpSession session) {
        validate(request.name(), request.email(), request.password());
        try {
            User user = authService.register(request.name(), request.email(), request.password());
            session.setAttribute("USER_ID", user.getId());
            session.setAttribute("USER_ROLE", user.getRole());
            return AuthUser.from(user);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    @PostMapping("/login")
    public AuthUser login(@RequestBody LoginRequest request, HttpSession session) {
        if (request.email() == null || request.password() == null || request.email().isBlank() || request.password().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required.");
        }
        try {
            User user = authService.login(request.email(), request.password());
            session.setAttribute("USER_ID", user.getId());
            session.setAttribute("USER_ROLE", user.getRole());
            return AuthUser.from(user);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    @GetMapping("/me")
    public AuthUser me(HttpSession session) {
        Object id = session.getAttribute("USER_ID");
        if (!(id instanceof Long userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in.");
        }
        User user = userService.getUserById(userId);
        if (user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account no longer exists.");
        return AuthUser.from(user);
    }

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }

    private void validate(String name, String email, String password) {
        if (name == null || name.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required.");
        if (email == null || email.isBlank() || !email.contains("@")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid email is required.");
        if (password == null || password.length() < 6) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters.");
    }

    public record RegisterRequest(String name, String email, String password) {}
    public record LoginRequest(String email, String password) {}
    public record AuthUser(Long id, String name, String email, String role) {
        public static AuthUser from(User u) { return new AuthUser(u.getId(), u.getName(), u.getEmail(), u.getRole()); }
    }

}
