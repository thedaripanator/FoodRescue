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

    /*
     * Create normal donation
     * and automatically match an NGO.
     */
    public Donation createDonation(
            DonationRequest request,
            String donorId) {

        Donation donation = new Donation();

        // Donor ID comes from JWT
        donation.setDonorId(donorId);

        donation.setFoodType(
                request.getFoodType()
        );

        donation.setQuantity(
                request.getQuantity()
        );

        donation.setEstimatedServings(
                request.getEstimatedServings()
        );

        donation.setLatitude(
                request.getLatitude()
        );

        donation.setLongitude(
                request.getLongitude()
        );

        donation.setPickupDeadline(
                request.getPickupDeadline()
        );

        donation.setUrgency(
                request.getUrgency() != null
                        ? request.getUrgency()
                        : "NORMAL"
        );

        donation.setStatus(
                DonationStatus.AVAILABLE
        );

        // Save first to generate ID
        Donation savedDonation =
                donationRepository.save(donation);

        // Automatically find best NGO
        matchService.findBestNgo(
                savedDonation.getId(),
                null
        );

        // Return updated donation
        return donationRepository.findById(
                savedDonation.getId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Donation could not be retrieved after matching"
                )
        );
    }

    public List<Donation> getAllDonations() {

        return donationRepository.findAll();
    }

    public Donation getDonationById(
            String id) {

        return donationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Donation not found with id: "
                                        + id
                        )
                );
    }

    /*
     * Create donation from food analysis
     * and automatically match an NGO.
     */
    public Donation createDonationFromAnalysis(
            ConfirmedDonationRequest request,
            String donorId) {

        Donation donation = new Donation();

        // Donor ID comes from JWT
        donation.setDonorId(donorId);

        donation.setFoodType(
                request.getFoodType()
        );

        donation.setEstimatedServings(
                request.getEstimatedServings()
        );

        donation.setLatitude(
                request.getLatitude()
        );

        donation.setLongitude(
                request.getLongitude()
        );

        donation.setPickupDeadline(
                request.getPickupDeadline()
        );

        donation.setUrgency(
                request.getUrgency() != null
                        ? request.getUrgency()
                        : "NORMAL"
        );

        donation.setStatus(
                DonationStatus.AVAILABLE
        );

        Donation savedDonation =
                donationRepository.save(donation);

        // Automatically find best NGO
        matchService.findBestNgo(
                savedDonation.getId(),
                null
        );

        return donationRepository.findById(
                savedDonation.getId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Donation could not be retrieved after matching"
                )
        );
    }

    public List<Donation> getDonationsByDonor(
            String donorId) {

        return donationRepository.findByDonorId(
                donorId
        );
    }

    public List<Donation> getDonationsByNgo(
            String ngoId) {

        return donationRepository
                .findByMatchedNgoId(ngoId);
    }
}