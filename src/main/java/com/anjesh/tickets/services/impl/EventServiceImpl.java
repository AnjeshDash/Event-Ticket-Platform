package com.anjesh.tickets.services.impl;

import com.anjesh.tickets.domain.CreateEventRequest;
import com.anjesh.tickets.domain.UpdateEventRequest;
import com.anjesh.tickets.domain.UpdateTicketTypeRequest;
import com.anjesh.tickets.domain.dtos.*;
import com.anjesh.tickets.domain.entities.Event;
import com.anjesh.tickets.domain.entities.EventStatusEnum;
import com.anjesh.tickets.domain.entities.TicketType;
import com.anjesh.tickets.domain.entities.User;
import com.anjesh.tickets.exceptions.EventNotFoundException;
import com.anjesh.tickets.exceptions.EventUpdateException;
import com.anjesh.tickets.exceptions.TicketTypeNotFoundException;
import com.anjesh.tickets.exceptions.UserNotFoundException;
import com.anjesh.tickets.mappers.EventMapper;
import com.anjesh.tickets.repositories.EventRepository;
import com.anjesh.tickets.repositories.UserRepository;
import com.anjesh.tickets.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    @Transactional
    public CreateEventResponseDto createEvent(UUID organizerId, CreateEventRequest event) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new UserNotFoundException(
                        String.format("User with ID '%s' not found", organizerId)));

        Event eventToCreate = new Event();

        List<TicketType> ticketTypesToCreate = event.getTicketTypes().stream().map(
                ticketType -> {
                    TicketType ticketTypeToCreate = new TicketType();
                    ticketTypeToCreate.setName(ticketType.getName());
                    ticketTypeToCreate.setPrice(ticketType.getPrice());
                    ticketTypeToCreate.setDescription(ticketType.getDescription());
                    ticketTypeToCreate.setTotalAvailable(ticketType.getTotalAvailable());
                    ticketTypeToCreate.setEvent(eventToCreate);
                    return ticketTypeToCreate;
                }).toList();

        eventToCreate.setName(event.getName());
        eventToCreate.setStart(event.getStart());
        eventToCreate.setEnd(event.getEnd());
        eventToCreate.setVenue(event.getVenue());
        eventToCreate.setSalesStart(event.getSalesStart());
        eventToCreate.setSalesEnd(event.getSalesEnd());
        eventToCreate.setStatus(event.getStatus());
        eventToCreate.setOrganizer(organizer);
        eventToCreate.setTicketTypes(ticketTypesToCreate);

        Event savedEvent = eventRepository.save(eventToCreate);
        return eventMapper.toDto(savedEvent);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ListEventResponseDto> listEventsForOrganizer(UUID organizerId, Pageable pageable) {
        return eventRepository.findByOrganizerId(organizerId, pageable)
                .map(eventMapper::toListEventResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GetEventDetailsResponseDto> getEventForOrganizer(UUID organizerId, UUID id) {
        return eventRepository.findByIdAndOrganizerId(id, organizerId)
                .map(eventMapper::toGetEventDetailsResponseDto);
    }

    @Override
    @Transactional
    public UpdateEventResponseDto updateEventForOrganizer(UUID organizerId, UUID id, UpdateEventRequest event) {
        if (null == event.getId()) {
            throw new EventUpdateException("Event ID cannot be null");
        }

        if (!id.equals(event.getId())) {
            throw new EventUpdateException("Cannot update the id of an event");
        }
        Event existingEvent = eventRepository
                .findByIdAndOrganizerId(id, organizerId)
                .orElseThrow(() -> new EventNotFoundException(
                        String.format("Event with ID '%s' does not exist", id)));
        existingEvent.setName(event.getName());
        existingEvent.setStart(event.getStart());
        existingEvent.setEnd(event.getEnd());
        existingEvent.setVenue(event.getVenue());
        existingEvent.setSalesStart(event.getSalesStart());
        existingEvent.setSalesEnd(event.getSalesEnd());
        existingEvent.setStatus(event.getStatus());

        Set<UUID> requestTicketTypesIds = event.getTicketTypes()
                .stream()
                .map(UpdateTicketTypeRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        existingEvent.getTicketTypes()
                .removeIf(existingTicketType -> !requestTicketTypesIds.contains(existingTicketType.getId()));

        Map<UUID, TicketType> existingTicketTypesIndex = existingEvent.getTicketTypes().stream()
                .collect(Collectors.toMap(TicketType::getId, Function.identity()));

        for (UpdateTicketTypeRequest ticketType : event.getTicketTypes()) {
            if (null == ticketType.getId()) {
                // Create
                TicketType ticketTypeToCreate = new TicketType();
                ticketTypeToCreate.setName(ticketType.getName());
                ticketTypeToCreate.setPrice(ticketType.getPrice());
                ticketTypeToCreate.setDescription(ticketType.getDescription());
                ticketTypeToCreate.setTotalAvailable(ticketType.getTotalAvailable());
                ticketTypeToCreate.setEvent(existingEvent);
                existingEvent.getTicketTypes().add(ticketTypeToCreate);

            } else if (existingTicketTypesIndex.containsKey(ticketType.getId())) {
                // Update
                TicketType existingTicketType = existingTicketTypesIndex.get(ticketType.getId());
                existingTicketType.setName(ticketType.getName());
                existingTicketType.setPrice(ticketType.getPrice());
                existingTicketType.setDescription(ticketType.getDescription());
                existingTicketType.setTotalAvailable(ticketType.getTotalAvailable());
            } else {
                throw new TicketTypeNotFoundException(String.format(
                        "Ticket type with ID '%s' does not exist", ticketType.getId()));
            }
        }

        Event savedEvent = eventRepository.save(existingEvent);
        return eventMapper.toUpdateEventResponseDto(savedEvent);
    }

    @Override
    @Transactional
    public void deleteEventForOrganizer(UUID organizerId, UUID id) {
        eventRepository.findByIdAndOrganizerId(id, organizerId)
                .ifPresent(eventRepository::delete);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ListPublishedEventResponseDto> listPublishedEvents(Pageable pageable) {
        return eventRepository.findByStatus(EventStatusEnum.PUBLISHED, pageable)
                .map(eventMapper::toListPublishedEventResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ListPublishedEventResponseDto> searchPublishedEvents(String query, Pageable pageable) {
        return eventRepository.searchEvents(query, pageable)
                .map(eventMapper::toListPublishedEventResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GetPublishedEventDetailsResponseDto> getPublishedEvent(UUID id) {
        return eventRepository.findByIdAndStatus(id, EventStatusEnum.PUBLISHED)
                .map(eventMapper::toGetPublishedEventDetailsResponseDto);
    }
}
