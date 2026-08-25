package com.Spring.FoodRescue.Repository;

import com.Spring.FoodRescue.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository
        extends MongoRepository<User, String> {

    Optional<User> findByGoogleId(String googleId);

    Optional<User> findByEmail(String email);
}