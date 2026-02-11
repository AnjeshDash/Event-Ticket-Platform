package com.anjesh.tickets.controllers;

import com.anjesh.tickets.domain.dtos.GetPublishedEventDetailsResponseDto;
import com.anjesh.tickets.domain.dtos.ListPublishedEventResponseDto;
import com.anjesh.tickets.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/published-events")
@RequiredArgsConstructor
public class PublishedEventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<Page<ListPublishedEventResponseDto>> listPublishedEvents(
            @RequestParam(required = false) String q,
            Pageable pageable) {

        if (null != q && !q.trim().isEmpty()) {
            return ResponseEntity.ok(eventService.searchPublishedEvents(q, pageable));
        } else {
            return ResponseEntity.ok(eventService.listPublishedEvents(pageable));
        }
    }

    @GetMapping(path = "/{eventId}")
    public ResponseEntity<GetPublishedEventDetailsResponseDto> getPublishedEventDetails(
            @PathVariable UUID eventId) {
        return eventService.getPublishedEvent(eventId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}