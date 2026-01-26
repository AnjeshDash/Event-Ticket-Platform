package com.anjesh.tickets.mappers;

import com.anjesh.tickets.domain.CreateEventRequest;
import com.anjesh.tickets.domain.CreateTicketTypeRequest;
import com.anjesh.tickets.domain.dtos.CreateEventRequestDto;
import com.anjesh.tickets.domain.dtos.CreateEventResponseDto;
import com.anjesh.tickets.domain.dtos.CreateTicketTypeRequestDto;
import com.anjesh.tickets.domain.entities.Event;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto toDto(Event event);

}
