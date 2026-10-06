package com.smartparking.smart_parking_backend.service;

import org.springframework.stereotype.Service;

import com.smartparking.smart_parking_backend.model.ParkingSpot;
import com.smartparking.smart_parking_backend.repository.ParkingSpotRepository;

import java.util.List;

@Service
public class ParkingSpotService {

    private final ParkingSpotRepository repository;

    public ParkingSpotService(ParkingSpotRepository repository) {
        this.repository = repository;
    }

    public ParkingSpot addParkingSpot(ParkingSpot parkingSpot) {
        return repository.save(parkingSpot);
    }

    public List<ParkingSpot> getAllParkingSpots() {
        return repository.findAll();
    }

    public List<ParkingSpot> getAvailableSpots() {
        return repository.findByAvailableTrue();
    }

    public ParkingSpot getParkingSpotById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public ParkingSpot updateParkingSpot(Long id, ParkingSpot parkingSpot) {
        ParkingSpot existingSpot = repository.findById(id).orElse(null);

        if (existingSpot == null) {
            return null;
        }

        existingSpot.setSpotNumber(parkingSpot.getSpotNumber());
        existingSpot.setLocation(parkingSpot.getLocation());
        existingSpot.setAvailable(parkingSpot.isAvailable());

        return repository.save(existingSpot);
    }

    public void deleteParkingSpot(Long id) {
        repository.deleteById(id);
    }
}