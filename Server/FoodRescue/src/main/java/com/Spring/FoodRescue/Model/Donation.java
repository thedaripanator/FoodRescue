package com.Spring.FoodRescue.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.Spring.FoodRescue.Model.DonationStatus;
import java.time.LocalDateTime;

@Document(collection = "donations")
@Data
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

    private DonationStatus  status;

    private String matchedNgoId;

   }