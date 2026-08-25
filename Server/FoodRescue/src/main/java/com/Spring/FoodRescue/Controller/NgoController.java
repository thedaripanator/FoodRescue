package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.DTO.NgoRequest;
import com.Spring.FoodRescue.Model.Donation;
import com.Spring.FoodRescue.Model.Ngo;
import com.Spring.FoodRescue.Model.User;
import com.Spring.FoodRescue.Service.DonationService;
import com.Spring.FoodRescue.Service.NgoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngos")
public class NgoController {

    private final NgoService ngoService;
    private final DonationService donationService;

    public NgoController(NgoService ngoService,DonationService donationService) {
        this.ngoService = ngoService;
        this.donationService=donationService;
    }


    @PostMapping
    public ResponseEntity<Ngo> registerNgo(
            @Valid @RequestBody NgoRequest request,
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        Ngo ngo =
                ngoService.registerNgo(
                        request,
                        user
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ngo);
    }

    @GetMapping
    public ResponseEntity<List<Ngo>> getAllNgos() {

        return ResponseEntity.ok(
                ngoService.getAllNgos()
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<Ngo> getNgoById(
            @PathVariable String id) {

        return ResponseEntity.ok(
                ngoService.getNgoById(id)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<Ngo> getMyNgo(
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                ngoService.getNgoByUserId(
                        user.getId()
                )
        );
    }
    @PutMapping("/{id}/verify")
    public ResponseEntity<Ngo> verifyNgo(
            @PathVariable String id) {

        Ngo ngo = ngoService.verifyNgo(id);

        return ResponseEntity.ok(ngo);
    }
    @GetMapping("/me/donations")
    public ResponseEntity<List<Donation>> getMyDonations(
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        Ngo ngo =
                ngoService.getNgoByUserId(
                        user.getId()
                );

        return ResponseEntity.ok(
                donationService.getDonationsByNgo(
                        ngo.getId()
                )
        );
    }
    @PutMapping("/me/availability")
    public ResponseEntity<Ngo> updateAvailability(
            @RequestParam boolean available,
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        Ngo ngo =
                ngoService.updateAvailability(
                        user.getId(),
                        available
                );

        return ResponseEntity.ok(ngo);
    }
}