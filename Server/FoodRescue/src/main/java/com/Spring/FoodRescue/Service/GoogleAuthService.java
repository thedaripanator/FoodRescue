package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.Model.User;
import com.Spring.FoodRescue.Repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;

    @Value("${google.client-id:}")
    private String googleClientId;

    public GoogleAuthService(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    public User authenticate(String idTokenString)
            throws Exception {

        /*
         * 1. Check Google Client ID
         */
        if (googleClientId == null ||
                googleClientId.isBlank()) {

            throw new RuntimeException(
                    "Google Client ID is not configured"
            );
        }

        /*
         * 2. Check received token
         */
        if (idTokenString == null ||
                idTokenString.isBlank()) {

            throw new IllegalArgumentException(
                    "Google ID token is empty"
            );
        }

        /*
         * Safe debugging information.
         *
         * DO NOT print the actual Google token.
         */
        System.out.println(
                "Google Client ID loaded: "
                        + !googleClientId.isBlank()
        );

        System.out.println(
                "Google token length: "
                        + idTokenString.length()
        );

        System.out.println(
                "Google token parts: "
                        + idTokenString.split("\\.", -1).length
        );

        /*
         * 3. Create Google ID Token verifier
         */
        GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                        GoogleNetHttpTransport.newTrustedTransport(),
                        GsonFactory.getDefaultInstance()
                )
                        .setAudience(
                                Collections.singletonList(
                                        googleClientId
                                )
                        )
                        .build();

        /*
         * 4. Verify Google ID token
         */
        GoogleIdToken idToken =
                verifier.verify(idTokenString);

        /*
         * verify() returns null when
         * the token is invalid.
         */
        if (idToken == null) {

            throw new RuntimeException(
                    "Invalid Google ID token"
            );
        }

        /*
         * 5. Get token payload
         */
        GoogleIdToken.Payload payload =
                idToken.getPayload();

        /*
         * 6. Extract Google user information
         */
        String googleId =
                payload.getSubject();

        String email =
                payload.getEmail();

        String name =
                (String) payload.get("name");

        /*
         * 7. Find existing user
         */
        User user =
                userRepository
                        .findByGoogleId(googleId)
                        .orElse(null);

        /*
         * 8. Create user if first login
         */
        if (user == null) {

            user = new User();

            user.setGoogleId(googleId);
            user.setEmail(email);
            user.setName(name);

            /*
             * Default role for new users
             */
            if (email != null && email.equals("sayondeepdapira@gmail.com")) {
                user.setRole("ADMIN");
            } else {
                user.setRole("DONOR");
            }

            user.setEnabled(true);

            user = userRepository.save(user);
        } else {
            // Upgrade existing user to ADMIN if their email matches
            if (email != null && email.equals("sayondeepdapira@gmail.com") && !"ADMIN".equals(user.getRole())) {
                user.setRole("ADMIN");
                user = userRepository.save(user);
            }
        }

        /*
         * 9. Check whether account is enabled
         */
        if (!user.isEnabled()) {

            throw new RuntimeException(
                    "User account is disabled"
            );
        }

        /*
         * 10. Return authenticated user
         */
        return user;
    }
}