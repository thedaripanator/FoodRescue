package com.Spring.FoodRescue.Controller;

import com.Spring.FoodRescue.DTO.NgoRequest;
import com.Spring.FoodRescue.Model.Ngo;
import com.Spring.FoodRescue.Service.NgoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngos")
public class NgoController {

    private final NgoService ngoService;

    public NgoController(NgoService ngoService) {
        this.ngoService = ngoService;
    }

    @PostMapping
    public ResponseEntity<Ngo> registerNgo(
            @Valid @RequestBody NgoRequest request) {

        Ngo ngo = ngoService.registerNgo(request);

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
}