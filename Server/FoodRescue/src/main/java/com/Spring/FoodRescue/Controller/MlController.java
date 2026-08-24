package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.DTO.DonationAnalysisResponse;
import com.Spring.FoodRescue.DTO.MlAnalysisResponse;
import com.Spring.FoodRescue.Service.MlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ml")
public class MlController {

    private final MlService mlService;

    public MlController(MlService mlService) {
        this.mlService = mlService;
    }

    @PostMapping(
            value = "/analyze-food",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<MlAnalysisResponse> analyzeFood(
            @RequestParam("image") MultipartFile image
    ) throws Exception {

        MlAnalysisResponse result =
                mlService.analyzeFood(image);

        return ResponseEntity.ok(result);
    }

    @PostMapping(
            value = "/analyze-donation",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<DonationAnalysisResponse> analyzeDonation(

            @RequestParam("image") MultipartFile image,

            @RequestParam("donorId") String donorId,

            @RequestParam("latitude") double latitude,

            @RequestParam("longitude") double longitude,

            @RequestParam("pickupDeadline") String pickupDeadline

    ) throws Exception {

        MlAnalysisResponse mlResult =
                mlService.analyzeFood(image);

        DonationAnalysisResponse response =
                new DonationAnalysisResponse();

        response.setDonorId(donorId);
        response.setLatitude(latitude);
        response.setLongitude(longitude);
        response.setPickupDeadline(pickupDeadline);

        response.setFoodAnalysis(
                mlResult.getAnalysis()
        );

        return ResponseEntity.ok(response);
    }
}