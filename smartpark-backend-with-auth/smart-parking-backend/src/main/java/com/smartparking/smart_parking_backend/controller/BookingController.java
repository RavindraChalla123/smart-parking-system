package com.smartparking.smart_parking_backend.controller;


import org.springframework.web.bind.annotation.*;

import com.smartparking.smart_parking_backend.model.Booking;
import com.smartparking.smart_parking_backend.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    public Booking createBooking(
            @RequestParam Long userId,
            @RequestParam Long parkingSpotId,
            @RequestBody Booking booking) {

        return service.createBooking(userId, parkingSpotId, booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return service.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return service.getBookingById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return service.getBookingsByUser(userId);
    }

    @PutMapping("/{id}/cancel")
    public String cancelBooking(@PathVariable Long id) {
        service.cancelBooking(id);
        return "Booking cancelled successfully";
    }
}