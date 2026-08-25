package com.Spring.FoodRescue.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "ngos")
public class Ngo {

    @Id
    private String id;

    private String userId;

    private String organizationName;

    private String email;

    private String phone;

    private String address;

    private double latitude;

    private double longitude;

    private int capacity;

    private List<String> acceptedFoodTypes;

    private boolean verified;

    private boolean available;
}