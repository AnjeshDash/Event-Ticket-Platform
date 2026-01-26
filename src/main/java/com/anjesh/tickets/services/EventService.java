package com.anjesh.tickets.services;

import com.anjesh.tickets.domain.CreateEventRequest;
import com.anjesh.tickets.domain.entities.Event;

import java.util.UUID;

public interface EventService {

    Event createEvent(UUID organizerId,CreateEventRequest event);

}
