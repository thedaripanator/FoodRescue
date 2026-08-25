package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.DTO.ConfirmedDonationRequest;
import com.Spring.FoodRescue.DTO.DonationRequest;
import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Model.User;
import com.Spring.FoodRescue.Service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(
            DonationService donationService) {

        this.donationService = donationService;
    }

    /*
     * Create normal donation
     */
    @PostMapping
    public ResponseEntity<Donation> createDonation(
            @Valid @RequestBody DonationRequest request,
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        Donation donation =
                donationService.createDonation(
                        request,
                        user.getId()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(donation);
    }

    /*
     * Get all donations
     */
    @GetMapping
    public ResponseEntity<List<Donation>> getAllDonations() {

        return ResponseEntity.ok(
                donationService.getAllDonations()
        );
    }

    /*
     * Get donation by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(
            @PathVariable String id) {

        return ResponseEntity.ok(
                donationService.getDonationById(id)
        );
    }

    /*
     * Create donation from food analysis
     */
    @PostMapping("/from-analysis")
    public ResponseEntity<Donation> createFromAnalysis(
            @Valid @RequestBody ConfirmedDonationRequest request,
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        Donation donation =
                donationService.createDonationFromAnalysis(
                        request,
                        user.getId()
                );

        return ResponseEntity.ok(donation);
    }
}