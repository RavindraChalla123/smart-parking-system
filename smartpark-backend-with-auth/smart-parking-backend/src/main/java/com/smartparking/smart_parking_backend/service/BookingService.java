package com.smartparking.smart_parking_backend.service;

import org.springframework.stereotype.Service;

import com.smartparking.smart_parking_backend.exception.ResourceNotFoundException;
import com.smartparking.smart_parking_backend.model.Booking;
import com.smartparking.smart_parking_backend.model.ParkingSpot;
import com.smartparking.smart_parking_backend.model.User;
import com.smartparking.smart_parking_backend.repository.BookingRepository;
import com.smartparking.smart_parking_backend.repository.ParkingSpotRepository;
import com.smartparking.smart_parking_backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ParkingSpotRepository parkingSpotRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ParkingSpotRepository parkingSpotRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.parkingSpotRepository = parkingSpotRepository;
    }

    public Booking createBooking(
            Long userId,
            Long parkingSpotId,
            Booking booking) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        ParkingSpot parkingSpot = parkingSpotRepository.findById(parkingSpotId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Parking spot not found"));

        LocalDateTime startTime = booking.getStartTime();
        LocalDateTime endTime = booking.getEndTime();

        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException(
                    "Start time and end time are required");
        }

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException(
                    "End time must be after start time");
        }

        if (!parkingSpot.isAvailable()) {
            throw new IllegalStateException(
                    "Parking spot is not available");
        }

        boolean alreadyBooked = bookingRepository.existsOverlappingBooking(
                parkingSpotId,
                startTime,
                endTime
        );

        if (alreadyBooked) {
            throw new IllegalStateException(
                    "Parking spot is already booked for this time");
        }

        booking.setUser(user);
        booking.setParkingSpot(parkingSpot);
        booking.setStatus("CONFIRMED");

        parkingSpot.setAvailable(false);
        parkingSpotRepository.save(parkingSpot);

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public void cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        booking.setStatus("CANCELLED");

        ParkingSpot parkingSpot = booking.getParkingSpot();

        if (parkingSpot != null) {
            parkingSpot.setAvailable(true);
            parkingSpotRepository.save(parkingSpot);
        }

        bookingRepository.save(booking);
    }
}