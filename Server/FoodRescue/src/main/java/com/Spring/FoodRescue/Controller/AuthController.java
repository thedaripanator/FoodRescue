package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.DTO.AuthResponse;
import com.Spring.FoodRescue.DTO.GoogleLoginRequest;
import com.Spring.FoodRescue.Model.User;
import com.Spring.FoodRescue.Service.GoogleAuthService;
import com.Spring.FoodRescue.Service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final GoogleAuthService googleAuthService;
    private final JwtService jwtService;

    public AuthController(
            GoogleAuthService googleAuthService,
            JwtService jwtService) {

        this.googleAuthService = googleAuthService;
        this.jwtService = jwtService;
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @RequestBody GoogleLoginRequest request) {

        try {

            // 1. Verify Google ID token
            User user =
                    googleAuthService.authenticate(
                            request.getIdToken()
                    );

            // 2. Generate FoodRescue JWT
            String token =
                    jwtService.generateToken(user);

            // 3. Return user + JWT
            AuthResponse response =
                    new AuthResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getRole(),
                            token,
                            "Google login successful"
                    );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            String message =
                    e.getMessage();

            if (message == null ||
                    message.isBlank()) {

                message =
                        e.getClass()
                                .getSimpleName();
            }

            return ResponseEntity
                    .status(401)
                    .body(
                            new AuthResponse(
                                    null,
                                    null,
                                    null,
                                    null,
                                    null,
                                    "Google authentication failed: "
                                            + message
                            )
                    );
        }
    }
}