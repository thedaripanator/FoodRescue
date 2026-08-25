package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Model.DonationStatus;
import com.Spring.FoodRescue.Model.Ngo;
import com.Spring.FoodRescue.Repository.DonationRepository;
import com.Spring.FoodRescue.Repository.NgoRepository;
import org.springframework.stereotype.Service;

@Service
public class DonationActionService {

    private final DonationRepository donationRepository;
    private final NgoRepository ngoRepository;
    private final MatchService matchService;

    public DonationActionService(
            DonationRepository donationRepository,
            NgoRepository ngoRepository,
            MatchService matchService) {

        this.donationRepository =
                donationRepository;

        this.ngoRepository =
                ngoRepository;

        this.matchService =
                matchService;
    }


    public Donation acceptDonation(
            String donationId,
            String userId) {

        Ngo ngo =
                getNgoByUserId(userId);

        Donation donation =
                getDonation(donationId);


        if (donation.getStatus()
                != DonationStatus.MATCHED) {

            throw new RuntimeException(
                    "Donation cannot be accepted in current status: "
                            + donation.getStatus()
            );
        }


        if (!ngo.getId().equals(
                donation.getMatchedNgoId())) {

            throw new RuntimeException(
                    "This NGO is not assigned to this donation"
            );
        }

        donation.setStatus(
                DonationStatus.ACCEPTED
        );

        return donationRepository.save(
                donation
        );
    }


    public Donation rejectDonation(
            String donationId,
            String userId) {

        Ngo ngo =
                getNgoByUserId(userId);

        Donation donation =
                getDonation(donationId);

        if (donation.getStatus()
                != DonationStatus.MATCHED) {

            throw new RuntimeException(
                    "Donation cannot be rejected in current status: "
                            + donation.getStatus()
            );
        }

        if (!ngo.getId().equals(
                donation.getMatchedNgoId())) {

            throw new RuntimeException(
                    "This NGO is not assigned to this donation"
            );
        }
        String rejectedNgoId =
                ngo.getId();

        donation.setMatchedNgoId(null);


        donation.setStatus(
                DonationStatus.AVAILABLE
        );

        Donation savedDonation =
                donationRepository.save(
                        donation
                );
        matchService.findBestNgo(
                savedDonation.getId(),
                rejectedNgoId
        );
        return donationRepository.findById(
                savedDonation.getId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Donation not found after rematching"
                )
        );
    }

    public Donation markPickedUp(
            String donationId,
            String userId) {

        Ngo ngo =
                getNgoByUserId(userId);

        Donation donation =
                getDonation(donationId);

        if (!ngo.getId().equals(
                donation.getMatchedNgoId())) {

            throw new RuntimeException(
                    "This NGO is not assigned to this donation"
            );
        }
        if (donation.getStatus()
                != DonationStatus.ACCEPTED) {

            throw new RuntimeException(
                    "Donation must be ACCEPTED before pickup"
            );
        }

        donation.setStatus(
                DonationStatus.PICKED_UP
        );

        return donationRepository.save(
                donation
        );
    }
    public Donation markDistributed(
            String donationId,
            String userId) {

        Ngo ngo =
                getNgoByUserId(userId);

        Donation donation =
                getDonation(donationId);

        if (!ngo.getId().equals(
                donation.getMatchedNgoId())) {

            throw new RuntimeException(
                    "This NGO is not assigned to this donation"
            );
        }
        if (donation.getStatus()
                != DonationStatus.PICKED_UP) {

            throw new RuntimeException(
                    "Donation must be PICKED_UP before distribution"
            );
        }

        donation.setStatus(
                DonationStatus.DISTRIBUTED
        );

        return donationRepository.save(
                donation
        );
    }

    private Ngo getNgoByUserId(
            String userId) {

        return ngoRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "NGO profile not found for user: "
                                        + userId
                        )
                );
    }
    private Donation getDonation(
            String donationId) {

        return donationRepository
                .findById(donationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Donation not found with id: "
                                        + donationId
                        )
                );
    }
}