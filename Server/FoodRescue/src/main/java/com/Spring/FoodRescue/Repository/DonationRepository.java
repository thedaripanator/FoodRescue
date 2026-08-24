package com.Spring.FoodRescue.Repository;

import com.Spring.FoodRescue.Model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationRepository extends MongoRepository<Donation, String> {
}
