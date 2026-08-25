package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.DTO.NgoRequest;
import com.Spring.FoodRescue.Model.Ngo;
import com.Spring.FoodRescue.Model.User;
import com.Spring.FoodRescue.Repository.NgoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NgoService {

    private final NgoRepository ngoRepository;

    public NgoService(NgoRepository ngoRepository) {
        this.ngoRepository = ngoRepository;
    }
    public Ngo registerNgo(
            NgoRequest request,
            User user) {
        if (ngoRepository
                .findByUserId(user.getId())
                .isPresent()) {

            throw new RuntimeException(
                    "NGO profile already exists for this user"
            );
        }

        Ngo ngo = new Ngo();
        ngo.setUserId(user.getId());
        ngo.setEmail(user.getEmail());

        ngo.setOrganizationName(
                request.getOrganizationName()
        );

        ngo.setPhone(
                request.getPhone()
        );

        ngo.setAddress(
                request.getAddress()
        );

        ngo.setLatitude(
                request.getLatitude()
        );

        ngo.setLongitude(
                request.getLongitude()
        );

        ngo.setCapacity(
                request.getCapacity()
        );

        ngo.setAcceptedFoodTypes(
                request.getAcceptedFoodTypes()
        );

        ngo.setVerified(false);

        ngo.setAvailable(false);

        return ngoRepository.save(ngo);
    }
    public List<Ngo> getAllNgos() {

        return ngoRepository.findAll();
    }
    public Ngo getNgoById(String id) {

        return ngoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "NGO not found with id: "
                                        + id
                        )
                );
    }
    public Ngo getNgoByUserId(
            String userId) {

        return ngoRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "NGO profile not found for user: "
                                        + userId
                        )
                );
    }
    public Ngo verifyNgo(String ngoId) {

        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "NGO not found with id: " + ngoId
                        )
                );

        ngo.setVerified(true);
        ngo.setAvailable(true);

        return ngoRepository.save(ngo);
    }
    public Ngo updateAvailability(
            String userId,
            boolean available) {

        Ngo ngo =
                getNgoByUserId(userId);

        if (!ngo.isVerified() && available) {

            throw new RuntimeException(
                    "NGO must be verified before becoming available"
            );
        }

        ngo.setAvailable(available);

        return ngoRepository.save(ngo);
    }
}