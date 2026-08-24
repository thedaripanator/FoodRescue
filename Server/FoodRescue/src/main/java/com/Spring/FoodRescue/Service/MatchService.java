package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.DTO.MatchResponse;
import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Model.DonationStatus;
import com.Spring.FoodRescue.Model.Ngo;
import com.Spring.FoodRescue.Repository.DonationRepository;
import com.Spring.FoodRescue.Repository.NgoRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class MatchService {

    private final DonationRepository donationRepository;
    private final NgoRepository ngoRepository;

    public MatchService(
            DonationRepository donationRepository,
            NgoRepository ngoRepository) {

        this.donationRepository = donationRepository;
        this.ngoRepository = ngoRepository;
    }

    /*
     * Find the best NGO.
     *
     * excludedNgoId:
     * - null for the first matching attempt
     * - rejected NGO ID when rematching after rejection
     */
    public MatchResponse findBestNgo(
            String donationId,
            String excludedNgoId) {

        // 1. Get donation
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Donation not found with id: "
                                        + donationId
                        )
                );

        // 2. Get all NGOs
        List<Ngo> ngos = ngoRepository.findAll();

        // 3. Filter suitable NGOs
        List<Ngo> suitableNgos = ngos.stream()

                .filter(Ngo::isAvailable)

                .filter(Ngo::isVerified)

                // Do not select the NGO that rejected it
                .filter(ngo ->
                        excludedNgoId == null
                                || !ngo.getId().equals(excludedNgoId)
                )

                .filter(ngo ->
                        ngo.getCapacity()
                                >= donation.getEstimatedServings()
                )

                .filter(ngo ->
                        ngo.getAcceptedFoodTypes() != null
                                &&
                                ngo.getAcceptedFoodTypes()
                                        .contains(donation.getFoodType())
                )

                .toList();

        // 4. No suitable NGO
        if (suitableNgos.isEmpty()) {

            // Keep donation available
            donation.setStatus(
                    DonationStatus.AVAILABLE
            );

            donation.setMatchedNgoId(null);

            donationRepository.save(donation);

            return new MatchResponse(
                    donation.getId(),
                    null,
                    null,
                    0.0,
                    0.0
            );
        }

        // 5. Find NGO with highest score
        Ngo bestNgo = suitableNgos.stream()
                .max(
                        Comparator.comparingDouble(
                                ngo ->
                                        calculateScore(
                                                donation,
                                                ngo
                                        )
                        )
                )
                .orElseThrow();

        // 6. Calculate distance
        double distance = calculateDistance(
                donation.getLatitude(),
                donation.getLongitude(),
                bestNgo.getLatitude(),
                bestNgo.getLongitude()
        );

        // 7. Calculate score
        double score =
                calculateScore(
                        donation,
                        bestNgo
                );

        // 8. Update donation
        donation.setMatchedNgoId(
                bestNgo.getId()
        );

        donation.setStatus(
                DonationStatus.MATCHED
        );

        donationRepository.save(donation);

        // 9. Return match result
        return new MatchResponse(
                donation.getId(),
                bestNgo.getId(),
                bestNgo.getOrganizationName(),
                distance,
                score
        );
    }

    /*
     * Calculate NGO matching score
     */
    private double calculateScore(
            Donation donation,
            Ngo ngo) {

        double distance =
                calculateDistance(
                        donation.getLatitude(),
                        donation.getLongitude(),
                        ngo.getLatitude(),
                        ngo.getLongitude()
                );

        // Distance score
        double distanceScore;

        if (distance <= 2) {
            distanceScore = 40;
        } else if (distance <= 5) {
            distanceScore = 30;
        } else if (distance <= 10) {
            distanceScore = 20;
        } else {
            distanceScore = 10;
        }

        // Capacity score
        double capacityRatio =
                (double) donation.getEstimatedServings()
                        / ngo.getCapacity();

        double capacityScore;

        if (capacityRatio <= 0.5) {
            capacityScore = 30;
        } else if (capacityRatio <= 0.8) {
            capacityScore = 20;
        } else {
            capacityScore = 10;
        }

        // Food compatibility
        double foodScore = 20;

        return distanceScore
                + capacityScore
                + foodScore;
    }

    /*
     * Calculate distance between donor and NGO
     * using Haversine formula.
     */
    private double calculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final double EARTH_RADIUS_KM = 6371.0;

        double latDistance =
                Math.toRadians(lat2 - lat1);

        double lonDistance =
                Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(latDistance / 2)
                        * Math.sin(latDistance / 2)
                        +
                        Math.cos(
                                Math.toRadians(lat1)
                        )
                                * Math.cos(
                                Math.toRadians(lat2)
                        )
                                *
                                Math.sin(lonDistance / 2)
                                * Math.sin(lonDistance / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                );

        return EARTH_RADIUS_KM * c;
    }
}