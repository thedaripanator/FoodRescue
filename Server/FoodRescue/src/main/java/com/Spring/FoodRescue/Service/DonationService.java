package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.DTO.ConfirmedDonationRequest;
import com.Spring.FoodRescue.DTO.DonationRequest;
import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Model.DonationStatus;
import com.Spring.FoodRescue.Repository.DonationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final MatchService matchService;

    public DonationService(
            DonationRepository donationRepository,
            MatchService matchService) {

        this.donationRepository = donationRepository;
        this.matchService = matchService;
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

        donation.setUrgency(
                request.getUrgency() != null
                        ? request.getUrgency()
                        : "NORMAL"
        );

        donation.setStatus(DonationStatus.AVAILABLE);

        return donationRepository.save(donation);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public Donation getDonationById(String id) {

        return donationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Donation not found with id: " + id
                        )
                );
    }

    public Donation createDonationFromAnalysis(
            ConfirmedDonationRequest request
    ) {

        Donation donation = new Donation();

        donation.setDonorId(request.getDonorId());
        donation.setFoodType(request.getFoodType());

        donation.setEstimatedServings(
                request.getEstimatedServings()
        );

        donation.setLatitude(request.getLatitude());
        donation.setLongitude(request.getLongitude());

        donation.setPickupDeadline(
                request.getPickupDeadline()
        );

        donation.setUrgency(
                request.getUrgency()
        );

        donation.setStatus(DonationStatus.AVAILABLE);

        // Save first so MongoDB generates the donation ID
        Donation savedDonation =
                donationRepository.save(donation);

        // Automatically find the best NGO
        matchService.findBestNgo(
                savedDonation.getId()
        );

        // Fetch the updated donation
        return donationRepository.findById(
                savedDonation.getId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Donation could not be retrieved after matching"
                )
        );
    }
}