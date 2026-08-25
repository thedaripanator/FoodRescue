package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.DTO.MatchResponse;
import com.Spring.FoodRescue.Service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    private final MatchService matchingService;

    public MatchingController(MatchService matchingService) {
        this.matchingService = matchingService;
    }

    @PostMapping("/donation/{donationId}")
    public ResponseEntity<MatchResponse> matchDonation(
            @PathVariable String donationId) {

        MatchResponse response =
                matchingService.findBestNgo(donationId,null);

        return ResponseEntity.ok(response);
    }
}