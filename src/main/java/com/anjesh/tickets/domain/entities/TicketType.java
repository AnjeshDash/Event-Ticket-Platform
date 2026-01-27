package com.anjesh.tickets.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "ticket_types")  // Confirmed on page 89
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketType {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.UUID)  // Page 89: "id - A unique identifier"
    private UUID id;

    @Column(name = "name", nullable = false)  // Page 89: "name - The type of ticket"
    private String name;

    @Column(name = "price", nullable = false)  // Page 89: "price - Cost of the ticket"
    private Double price;

    @Column(name = "description")  // Page 113: "A field named description has been added"
    private String description;    // This was added based on UI requirements

    @Column(name = "total_available")  // Page 89: "totalAvailable - Maximum number that can be sold"
    private Integer totalAvailable;

    @ManyToOne(fetch = FetchType.LAZY)  // Page 89: TicketType belongs to an Event
    @JoinColumn(name = "event_id")  // Page 90: Added to Event class update
    private Event event;  // Critical fix from page 126: Must set this in service layer

    @OneToMany(mappedBy = "ticketType", cascade = CascadeType.ALL)  // Page 92-93: Added tickets reference
    private List<Ticket> tickets = new ArrayList<>();  // Page 93: "private List<Ticket> tickets = new ArrayList<>();"

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)  // Page 89: Audit field
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)  // Page 89: Audit field
    private LocalDateTime updatedAt;

    // Page 98-99: Equals and HashCode implementation guidelines
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TicketType that = (TicketType) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getName(), that.getName()) &&
                Objects.equals(getPrice(), that.getPrice()) &&
                Objects.equals(getDescription(), that.getDescription()) &&
                Objects.equals(getTotalAvailable(), that.getTotalAvailable()) &&
                Objects.equals(getCreatedAt(), that.getCreatedAt()) &&
                Objects.equals(getUpdatedAt(), that.getUpdatedAt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getPrice(), getDescription(),
                getTotalAvailable(), getCreatedAt(), getUpdatedAt());
    }
}