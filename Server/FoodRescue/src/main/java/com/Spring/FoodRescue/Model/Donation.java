package com.Spring.FoodRescue.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "donations")
public class Donation {

    @Id
    private String id;

    private String donorId;

    private String foodType;

    private double quantity;

    private int estimatedServings;

    private double latitude;

    private double longitude;

    private LocalDateTime pickupDeadline;

    private String urgency;

    private String status;

    private String matchedNgoId;

    public Donation() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDonorId() {
        return donorId;
    }

    public void setDonorId(String donorId) {
        this.donorId = donorId;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public int getEstimatedServings() {
        return estimatedServings;
    }

    public void setEstimatedServings(int estimatedServings) {
        this.estimatedServings = estimatedServings;
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

    public LocalDateTime getPickupDeadline() {
        return pickupDeadline;
    }

    public void setPickupDeadline(LocalDateTime pickupDeadline) {
        this.pickupDeadline = pickupDeadline;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMatchedNgoId() {
        return matchedNgoId;
    }

    public void setMatchedNgoId(String matchedNgoId) {
        this.matchedNgoId = matchedNgoId;
    }
}