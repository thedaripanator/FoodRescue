package com.Spring.FoodRescue.DTO;

import jakarta.validation.constraints.*;

import java.util.List;

public class NgoRequest {

    @NotBlank(message = "Organization name is required")
    private String organizationName;

    @NotBlank(message = "Phone is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone must contain 10 digits"
    )
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @DecimalMin(
            value = "-90.0",
            message = "Invalid latitude"
    )
    @DecimalMax(
            value = "90.0",
            message = "Invalid latitude"
    )
    private double latitude;

    @DecimalMin(
            value = "-180.0",
            message = "Invalid longitude"
    )
    @DecimalMax(
            value = "180.0",
            message = "Invalid longitude"
    )
    private double longitude;

    @Positive(message = "Capacity must be greater than 0")
    private int capacity;

    @NotEmpty(message = "At least one food type is required")
    private List<String> acceptedFoodTypes;

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public List<String> getAcceptedFoodTypes() {
        return acceptedFoodTypes;
    }

    public void setAcceptedFoodTypes(
            List<String> acceptedFoodTypes) {
        this.acceptedFoodTypes = acceptedFoodTypes;
    }
}