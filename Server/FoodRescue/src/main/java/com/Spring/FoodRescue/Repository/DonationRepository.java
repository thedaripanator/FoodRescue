package com.Spring.FoodRescue.Repository;

import com.Spring.FoodRescue.Model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DonationRepository
        extends MongoRepository<Donation, String> {

    List<Donation> findByDonorId(String donorId);

    List<Donation> findByMatchedNgoId(String matchedNgoId);
}