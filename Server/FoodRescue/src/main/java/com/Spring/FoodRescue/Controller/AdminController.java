package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Service.DonationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DonationService donationService;

    public AdminController(
            DonationService donationService) {

        this.donationService = donationService;
    }

    /*
     * Admin can view all donations
     */
    @GetMapping("/donations")
    public ResponseEntity<List<Donation>> getAllDonations() {

        return ResponseEntity.ok(
                donationService.getAllDonations()
        );
    }
}