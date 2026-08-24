package com.Spring.FoodRescue.DTO;

import lombok.Data;

@Data
public class MlAnalysisResponse {

    private String filename;

    private FoodAnalysisResponse analysis;
}