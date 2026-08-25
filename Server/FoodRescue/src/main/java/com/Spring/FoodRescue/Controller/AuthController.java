package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.DTO.AuthResponse;
import com.Spring.FoodRescue.DTO.GoogleLoginRequest;
import com.Spring.FoodRescue.Model.User;
import com.Spring.FoodRescue.Service.GoogleAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final GoogleAuthService googleAuthService;

    public AuthController(
            GoogleAuthService googleAuthService) {

        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @RequestBody GoogleLoginRequest request
    ) {

        try {

            User user =
                    googleAuthService.authenticate(
                            request.getIdToken()
                    );

            AuthResponse response =
                    new AuthResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getRole(),
                            "Google login successful"
                    );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            String message = e.getMessage();

            if (message == null || message.isBlank()) {
                message = e.getClass().getSimpleName();
            }

            return ResponseEntity
                    .status(401)
                    .body(
                            new AuthResponse(
                                    null,
                                    null,
                                    null,
                                    null,
                                    "Google authentication failed: " + message
                            )
                    );
        }
    }
}