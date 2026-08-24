package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.DTO.DonationRequest;
import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Repository.DonationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    public Donation createDonation(DonationRequest request) {

        Donation donation = new Donation();

        donation.setDonorId(request.getDonorId());
        donation.setFoodType(request.getFoodType());
        donation.setQuantity(request.getQuantity());
        donation.setEstimatedServings(request.getEstimatedServings());
        donation.setLatitude(request.getLatitude());
        donation.setLongitude(request.getLongitude());
        donation.setPickupDeadline(request.getPickupDeadline());

        // Default values for a newly created donation
        donation.setUrgency(
                request.getUrgency() != null
                        ? request.getUrgency()
                        : "NORMAL"
        );

        donation.setStatus("AVAILABLE");

        return donationRepository.save(donation);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public Donation getDonationById(String id) {
        return donationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Donation not found with id: " + id)
                );
    }
}