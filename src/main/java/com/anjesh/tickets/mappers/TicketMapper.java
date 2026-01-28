package com.anjesh.tickets.mappers;

import com.anjesh.tickets.domain.dtos.ListTicketResponseDto;
import com.anjesh.tickets.domain.dtos.ListTicketTicketTypeResponseDto;
import com.anjesh.tickets.domain.entities.Ticket;
import com.anjesh.tickets.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {

    ListTicketTicketTypeResponseDto toListTicketTicketTypeResponseDto(TicketType ticketType);

    ListTicketResponseDto toListTicketResponseDto(Ticket ticket);

}
