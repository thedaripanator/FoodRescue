package com.Spring.FoodRescue.DTO;

import lombok.Data;

@Data
public class MatchResponse {
    private String donationId;
    private String ngoId;
    private String organizationName;
    private double distanceKm;
    private double matchScore;

    public MatchResponse(
            String donationId,
            String ngoId,
            String organizationName,
            double distanceKm,
            double matchScore) {

        this.donationId = donationId;
        this.ngoId = ngoId;
        this.organizationName = organizationName;
        this.distanceKm = distanceKm;
        this.matchScore = matchScore;
    }


}
