package com.anjesh.tickets.services;

import com.anjesh.tickets.domain.CreateEventRequest;
import com.anjesh.tickets.domain.UpdateEventRequest;
import com.anjesh.tickets.domain.dtos.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface EventService {

    CreateEventResponseDto createEvent(UUID organizerId, CreateEventRequest event);

    Page<ListEventResponseDto> listEventsForOrganizer(UUID organizerId, Pageable pageable);

    Optional<GetEventDetailsResponseDto> getEventForOrganizer(UUID organizerId, UUID id);

    UpdateEventResponseDto updateEventForOrganizer(UUID organizerId, UUID id, UpdateEventRequest event);

    void deleteEventForOrganizer(UUID organizerId, UUID id);

    Page<ListPublishedEventResponseDto> listPublishedEvents(Pageable pageable);

    Page<ListPublishedEventResponseDto> searchPublishedEvents(String query, Pageable pageable);

    Optional<GetPublishedEventDetailsResponseDto> getPublishedEvent(UUID id);

}
