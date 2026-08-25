package com.Spring.FoodRescue.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ConfirmedDonationRequest {

    @NotBlank(message = "Food type is required")
    private String foodType;

    @Positive(message = "Estimated servings must be greater than 0")
    private int estimatedServings;

    private double latitude;

    private double longitude;

    private LocalDateTime pickupDeadline;

    private String urgency;
}