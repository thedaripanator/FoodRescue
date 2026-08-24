package com.Spring.FoodRescue.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class NgoRequest {
    @NotBlank
    private String organizationName;

    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @Min(1)
    private int capacity;

    private List<String> acceptedFoodTypes;
}
