package com.anjesh.tickets.services.impl;

import com.anjesh.tickets.domain.dtos.GetTicketResponseDto;
import com.anjesh.tickets.domain.dtos.ListTicketResponseDto;
import com.anjesh.tickets.mappers.TicketMapper;
import com.anjesh.tickets.repositories.TicketRepository;
import com.anjesh.tickets.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ListTicketResponseDto> listTicketsForUser(UUID userId, Pageable pageable) {
        return ticketRepository.findByPurchaserId(userId, pageable)
                .map(ticketMapper::toListTicketResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GetTicketResponseDto> getTicketForUser(UUID userId, UUID ticketId) {
        return ticketRepository.findByIdAndPurchaserId(ticketId, userId)
                .map(ticketMapper::toGetTicketResponseDto);
    }
}
