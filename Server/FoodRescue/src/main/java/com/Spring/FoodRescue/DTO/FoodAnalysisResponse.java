package com.Spring.FoodRescue.DTO;

import lombok.Data;

import java.util.List;

@Data
public class FoodAnalysisResponse {

    private String foodType;

    private List<String> foodItems;

    private int estimatedServings;

    private double confidence;

    private String suitability;

    private String urgency;
}