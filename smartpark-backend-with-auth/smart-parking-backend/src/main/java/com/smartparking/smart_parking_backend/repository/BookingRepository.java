package com.smartparking.smart_parking_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartparking.smart_parking_backend.model.Booking;


import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByParkingSpotId(Long parkingSpotId);

    @Query("""
        SELECT COUNT(b) > 0
        FROM Booking b
        WHERE b.parkingSpot.id = :parkingSpotId
        AND b.status = 'CONFIRMED'
        AND b.startTime < :endTime
        AND b.endTime > :startTime
    """)
    boolean existsOverlappingBooking(
            Long parkingSpotId,
            LocalDateTime startTime,
            LocalDateTime endTime);
}