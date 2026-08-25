package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Model.User;
import com.Spring.FoodRescue.Service.DonationActionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donations")
public class DonationActionController {

    private final DonationActionService donationActionService;

    public DonationActionController(
            DonationActionService donationActionService) {

        this.donationActionService =
                donationActionService;
    }

    @PostMapping("/{donationId}/accept")
    public ResponseEntity<Donation> acceptDonation(
            @PathVariable String donationId,
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        Donation donation =
                donationActionService.acceptDonation(
                        donationId,
                        user.getId()
                );

        return ResponseEntity.ok(donation);
    }

    @PostMapping("/{donationId}/reject")
    public ResponseEntity<Donation> rejectDonation(
            @PathVariable String donationId,
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        Donation donation =
                donationActionService.rejectDonation(
                        donationId,
                        user.getId()
                );

        return ResponseEntity.ok(donation);
    }

    @PostMapping("/{donationId}/pickup")
    public ResponseEntity<Donation> markPickedUp(
            @PathVariable String donationId,
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        Donation donation =
                donationActionService.markPickedUp(
                        donationId,
                        user.getId()
                );

        return ResponseEntity.ok(donation);
    }
    @PostMapping("/{donationId}/distributed")
    public ResponseEntity<Donation> markDistributed(
            @PathVariable String donationId,
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        Donation donation =
                donationActionService.markDistributed(
                        donationId,
                        user.getId()
                );

        return ResponseEntity.ok(donation);
    }
}