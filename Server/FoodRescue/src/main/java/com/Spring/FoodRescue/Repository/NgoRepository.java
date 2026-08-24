package com.Spring.FoodRescue.Repository;

import com.Spring.FoodRescue.Model.Ngo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NgoRepository extends MongoRepository<Ngo, String> {
}
