package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.DTO.DonationRequest;
import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<Donation> createDonation(
            @Valid @RequestBody DonationRequest request) {

        Donation donation = donationService.createDonation(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(donation);
    }

    @GetMapping
    public ResponseEntity<List<Donation>> getAllDonations() {

        return ResponseEntity.ok(
                donationService.getAllDonations()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(
            @PathVariable String id) {

        return ResponseEntity.ok(
                donationService.getDonationById(id)
        );
    }
}