package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.DTO.NgoRequest;
import com.Spring.FoodRescue.Model.Ngo;
import com.Spring.FoodRescue.Repository.NgoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NgoService {
    private final NgoRepository ngoRepository;

    public NgoService(NgoRepository ngoRepository) {
        this.ngoRepository = ngoRepository;
    }

    public Ngo registerNgo(NgoRequest request) {

        Ngo ngo = new Ngo();

        ngo.setOrganizationName(request.getOrganizationName());
        ngo.setEmail(request.getEmail());
        ngo.setPhone(request.getPhone());
        ngo.setAddress(request.getAddress());
        ngo.setLatitude(request.getLatitude());
        ngo.setLongitude(request.getLongitude());
        ngo.setCapacity(request.getCapacity());
        ngo.setAcceptedFoodTypes(request.getAcceptedFoodTypes());

        // New NGOs are not verified automatically
        ngo.setVerified(false);

        // Assume NGO is available after registration
        ngo.setAvailable(true);

        return ngoRepository.save(ngo);
    }

    public List<Ngo> getAllNgos() {
        return ngoRepository.findAll();
    }

    public Ngo getNgoById(String id) {
        return ngoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("NGO not found with id: " + id)
                );
    }
}
