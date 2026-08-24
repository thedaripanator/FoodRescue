package com.Spring.FoodRescue.DTO;

import lombok.Data;

@Data
public class DonationAnalysisResponse {
    private String donorId;

    private double latitude;

    private double longitude;

    private String pickupDeadline;

    private FoodAnalysisResponse foodAnalysis;
}
