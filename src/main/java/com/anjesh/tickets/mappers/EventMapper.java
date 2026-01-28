package com.anjesh.tickets.mappers;

import com.anjesh.tickets.domain.CreateEventRequest;
import com.anjesh.tickets.domain.CreateTicketTypeRequest;
import com.anjesh.tickets.domain.UpdateEventRequest;
import com.anjesh.tickets.domain.UpdateTicketTypeRequest;
import com.anjesh.tickets.domain.dtos.*;
import com.anjesh.tickets.domain.entities.Event;
import com.anjesh.tickets.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    // From page 121: Create event mapping methods
    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto toDto(Event event);

    ListEventTicketTypeResponseDto toDto(TicketType ticketType);

    ListEventResponseDto toListEventResponseDto(Event event);

    GetEventDetailsTicketTypesResponseDto toGetEventDetailsTicketTypesResponseDto(TicketType ticketType);

    GetEventDetailsResponseDto toGetEventDetailsResponseDto(Event event);

    // From page 159: Update event mapping methods
    UpdateTicketTypeRequest fromDto(UpdateTicketTypeRequestDto dto);

    UpdateEventRequest fromDto(UpdateEventRequestDto dto);

    UpdateTicketTypeResponseDto toUpdateTicketTypeResponseDto(TicketType ticketType);

    UpdateEventResponseDto toUpdateEventResponseDto(Event event);

    // From page 173: Published events mapping methods
    ListPublishedEventResponseDto toListPublishedEventResponseDto(Event event);

    // From page 189: Get published event details mapping methods
    GetPublishedEventDetailsTicketTypesResponseDto toGetPublishedEventDetailsTicketTypesResponseDto(TicketType ticketType);

    GetPublishedEventDetailsResponseDto toGetPublishedEventDetailsResponseDto(Event event);
}