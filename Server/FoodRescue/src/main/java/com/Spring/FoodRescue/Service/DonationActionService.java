package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Model.DonationStatus;
import com.Spring.FoodRescue.Repository.DonationRepository;
import org.springframework.stereotype.Service;

@Service
public class DonationActionService {

    private final DonationRepository donationRepository;
    private final MatchService matchService;

    public DonationActionService(
            DonationRepository donationRepository,
            MatchService matchService) {

        this.donationRepository = donationRepository;
        this.matchService = matchService;
    }

    /*
     * NGO accepts the matched donation
     */
    public Donation acceptDonation(String donationId, String ngoId) {

        Donation donation = getDonation(donationId);

        // Make sure the donation is actually matched
        if (donation.getStatus() != DonationStatus.MATCHED) {
            throw new RuntimeException(
                    "Donation cannot be accepted in current status: "
                            + donation.getStatus()
            );
        }

        // Make sure this NGO was selected
        if (!ngoId.equals(donation.getMatchedNgoId())) {
            throw new RuntimeException(
                    "This NGO is not assigned to this donation"
            );
        }

        donation.setStatus(DonationStatus.ACCEPTED);

        return donationRepository.save(donation);
    }

    /*
     * NGO rejects the donation
     */
    public Donation rejectDonation(
            String donationId,
            String ngoId) {

        Donation donation = getDonation(donationId);

        if (donation.getStatus() != DonationStatus.MATCHED) {
            throw new RuntimeException(
                    "Donation cannot be rejected in current status: "
                            + donation.getStatus()
            );
        }

        if (!ngoId.equals(donation.getMatchedNgoId())) {
            throw new RuntimeException(
                    "This NGO is not assigned to this donation"
            );
        }

        // Remember the NGO that rejected the donation
        String rejectedNgoId = donation.getMatchedNgoId();

        // Remove the current NGO
        donation.setMatchedNgoId(null);

        // Put donation back into matching pool
        donation.setStatus(DonationStatus.AVAILABLE);

        Donation savedDonation =
                donationRepository.save(donation);

        // Find another NGO, excluding the rejected NGO
        matchService.findBestNgo(
                savedDonation.getId(),
                rejectedNgoId
        );

        // Return the updated donation
        return donationRepository.findById(
                savedDonation.getId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Donation not found after rematching"
                )
        );
    }
    /*
     * Food has been picked up
     */
    public Donation markPickedUp(String donationId) {

        Donation donation = getDonation(donationId);

        if (donation.getStatus() != DonationStatus.ACCEPTED) {
            throw new RuntimeException(
                    "Donation must be ACCEPTED before pickup"
            );
        }

        donation.setStatus(DonationStatus.PICKED_UP);

        return donationRepository.save(donation);
    }

    /*
     * Food has been distributed
     */
    public Donation markDistributed(String donationId) {

        Donation donation = getDonation(donationId);

        if (donation.getStatus() != DonationStatus.PICKED_UP) {
            throw new RuntimeException(
                    "Donation must be PICKED_UP before distribution"
            );
        }

        donation.setStatus(DonationStatus.DISTRIBUTED);

        return donationRepository.save(donation);
    }

    private Donation getDonation(String donationId) {

        return donationRepository.findById(donationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Donation not found with id: "
                                        + donationId
                        )
                );
    }
}