package com.anjesh.tickets.services;

import com.anjesh.tickets.domain.entities.QrCode;
import com.anjesh.tickets.domain.entities.Ticket;

public interface QrCodeService {

    QrCode generateQrCode(Ticket ticket);
}
