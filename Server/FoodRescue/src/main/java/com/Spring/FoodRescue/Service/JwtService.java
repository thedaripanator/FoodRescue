package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.Model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(
            @Value("${jwt.secret}") String secret) {

        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must contain at least 32 characters"
            );
        }

        this.secretKey =
                Keys.hmacShaKeyFor(
                        secret.getBytes(
                                StandardCharsets.UTF_8
                        )
                );
    }

    public String generateToken(User user) {

        Date now = new Date();

        Date expiration =
                new Date(
                        now.getTime()
                                + 1000L
                                * 60
                                * 60
                                * 24
                );

        return Jwts.builder()

                .subject(user.getId())

                .claim(
                        "email",
                        user.getEmail()
                )

                .claim(
                        "name",
                        user.getName()
                )

                .claim(
                        "role",
                        user.getRole()
                )

                .issuedAt(now)

                .expiration(expiration)

                .signWith(secretKey)

                .compact();
    }

    public Claims extractClaims(
            String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUserId(
            String token) {

        return extractClaims(token)
                .getSubject();
    }

    public String extractRole(
            String token) {

        return extractClaims(token)
                .get("role", String.class);
    }

    public boolean isTokenValid(
            String token) {

        try {

            Claims claims =
                    extractClaims(token);

            return claims.getExpiration()
                    .after(new Date());

        } catch (Exception e) {

            return false;
        }
    }
}