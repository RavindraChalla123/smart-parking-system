package com.smartparking.smart_parking_backend.controller;

import org.springframework.web.bind.annotation.*;

import com.smartparking.smart_parking_backend.model.ParkingSpot;
import com.smartparking.smart_parking_backend.service.ParkingSpotService;

import java.util.List;

@RestController
@RequestMapping("/parking-spots")
public class ParkingSpotController {

    private final ParkingSpotService service;

    public ParkingSpotController(ParkingSpotService service) {
        this.service = service;
    }

    @PostMapping
    public ParkingSpot addParkingSpot(@RequestBody ParkingSpot parkingSpot) {
        return service.addParkingSpot(parkingSpot);
    }

    @GetMapping
    public List<ParkingSpot> getAllParkingSpots() {
        return service.getAllParkingSpots();
    }

    @GetMapping("/available")
    public List<ParkingSpot> getAvailableSpots() {
        return service.getAvailableSpots();
    }

    @GetMapping("/{id}")
    public ParkingSpot getParkingSpotById(@PathVariable Long id) {
        return service.getParkingSpotById(id);
    }

    @PutMapping("/{id}")
    public ParkingSpot updateParkingSpot(
            @PathVariable Long id,
            @RequestBody ParkingSpot parkingSpot) {
        return service.updateParkingSpot(id, parkingSpot);
    }

    @DeleteMapping("/{id}")
    public String deleteParkingSpot(@PathVariable Long id) {
        service.deleteParkingSpot(id);
        return "Parking spot deleted successfully";
    }
}