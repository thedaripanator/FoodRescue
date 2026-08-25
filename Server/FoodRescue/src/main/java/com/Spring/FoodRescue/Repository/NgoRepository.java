package com.Spring.FoodRescue.Repository;

import com.Spring.FoodRescue.Model.Ngo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface NgoRepository
        extends MongoRepository<Ngo, String> {

    Optional<Ngo> findByUserId(String userId);
}