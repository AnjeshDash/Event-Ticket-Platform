package com.anjesh.tickets.domain.dtos;

import com.anjesh.tickets.domain.entities.TicketStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListTicketResponseDto {

    private UUID id;
    private TicketStatusEnum status;
    private ListTicketTicketTypeResponseDto ticketType;


}
