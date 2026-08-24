package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Service.DonationActionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donations")
public class DonationActionController {

    private final DonationActionService donationActionService;

    public DonationActionController(
            DonationActionService donationActionService) {

        this.donationActionService = donationActionService;
    }

    /*
     * NGO accepts donation
     */
    @PostMapping("/{donationId}/accept")
    public ResponseEntity<Donation> acceptDonation(
            @PathVariable String donationId,
            @RequestParam String ngoId) {

        Donation donation =
                donationActionService.acceptDonation(
                        donationId,
                        ngoId
                );

        return ResponseEntity.ok(donation);
    }

    /*
     * NGO rejects donation
     */
    @PostMapping("/{donationId}/reject")
    public ResponseEntity<Donation> rejectDonation(
            @PathVariable String donationId,
            @RequestParam String ngoId) {

        Donation donation =
                donationActionService.rejectDonation(
                        donationId,
                        ngoId
                );

        return ResponseEntity.ok(donation);
    }

    /*
     * Mark food as picked up
     */
    @PostMapping("/{donationId}/pickup")
    public ResponseEntity<Donation> markPickedUp(
            @PathVariable String donationId) {

        Donation donation =
                donationActionService.markPickedUp(
                        donationId
                );

        return ResponseEntity.ok(donation);
    }

    /*
     * Mark food as distributed
     */
    @PostMapping("/{donationId}/distributed")
    public ResponseEntity<Donation> markDistributed(
            @PathVariable String donationId) {

        Donation donation =
                donationActionService.markDistributed(
                        donationId
                );

        return ResponseEntity.ok(donation);
    }
}