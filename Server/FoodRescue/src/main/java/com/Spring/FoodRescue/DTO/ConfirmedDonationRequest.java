package com.Spring.FoodRescue.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ConfirmedDonationRequest {

    private String donorId;

    private String foodType;

    private int estimatedServings;

    private double latitude;

    private double longitude;

    private LocalDateTime pickupDeadline;

    private String urgency;
}