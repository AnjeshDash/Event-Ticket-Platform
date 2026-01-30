# Event Ticket Management Platform

A production-ready full-stack solution for event management, ticket distribution, and QR-based validation.

## 🚀 Key Features

- **Event Lifecycle Management:** Organizers can create, update, and publish events with dynamic ticket types.
- **Secure Ticketing:** Attendees browse events, purchase tickets via a mock payment gateway, and receive unique QR codes.
- **On-Site Validation:** Staff interface with QR scanner (integrated camera) for real-time ticket validation and manual entry support.
- **Enterprise Auth:** Integrated with **Keycloak (OIDC)** for robust identity management and Role-Based Access Control (RBAC).
- **Automated Provisioning:** Seamless user synchronization between identity provider and local database.

## 🛠 Tech Stack

- **Backend:** Java 17, Spring Boot 3, Spring Security (OAuth2/JWT), JPA/Hibernate, PostgreSQL, MapStruct, Lombok.
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Router 7.
- **Infrastructure:** Docker, Docker Compose, Keycloak.

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
- **Java 17 (JDK)**
- **Node.js (v18+)**
- **Docker & Docker Compose**
- **Maven** (optional, uses `./mvnw` wrapper)

---

## 🏃 Running the Application

### 1. Infrastructure (Docker)
Launch the database and identity provider:
```bash
docker-compose up -d
```
*Accessible at: DB (5432), Adminer (8888), Keycloak (9090)*

### 🔑 2. Keycloak Configuration (Required)
Since this project uses Keycloak for authentication, you need to perform a one-time setup:
1. Access the Keycloak Console at `http://localhost:9090` (Admin: `admin` / `Anjesh@123`).
2. **Create Realm:** `event-ticket-platform`.
3. **Create Client:** `event-ticket-platform-app` (Set 'Standard Flow' Enabled, Valid Redirect URIs: `http://localhost:5173/*`, Web Origins: `*`).
4. **Create Roles:** `ROLE_ORGANIZER`, `ROLE_ATTENDEE`, `ROLE_STAFF`.
5. **Create Test User:** Create a user and assign one or more roles under the 'Role Mapping' tab.

### 3. Backend (Spring Boot)
1. Grant execution permissions (Linux/macOS):
```bash
chmod +x mvnw
```
2. Start the service:
```bash
./mvnw spring-boot:run
```
*Backend API available at: `http://localhost:8080`*

### 4. Frontend (React)
1. Install dependencies and start:
```bash
cd front-end
npm install
npm run dev
```
*Frontend UI available at: `http://localhost:5173`*

---

## 🔐 Role-Based Access
- **ORGANIZER:** Can create/update events and define ticket types.
- **ATTENDEE:** Can browse events and purchase tickets.
- **STAFF:** Can access the QR validation interface.
