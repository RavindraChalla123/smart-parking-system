package com.smartparking.smart_parking_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartparking.smart_parking_backend.model.ParkingSpot;

public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
    List<ParkingSpot> findByAvailableTrue();
}
