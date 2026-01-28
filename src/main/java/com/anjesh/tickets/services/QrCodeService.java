package com.anjesh.tickets.services;

import com.anjesh.tickets.domain.entities.QrCode;
import com.anjesh.tickets.domain.entities.Ticket;

import java.util.UUID;

public interface QrCodeService {

    QrCode generateQrCode(Ticket ticket);

    byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
