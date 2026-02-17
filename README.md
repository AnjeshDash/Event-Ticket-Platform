# 🎫 Event Ticket Management Platform

**Production-grade full-stack platform** demonstrating enterprise-level event management, secure ticketing workflows, and real-time QR validation. Designed with scalable architecture, strong authentication, and concurrency-safe booking logic.

---

## 🚀 Architecture Highlights

### 🏗 Enterprise Backend

* **Spring Boot + Java 21** — Modern JVM ecosystem
* **Spring Security + OAuth2/JWT** — Enterprise-grade authentication
* **JPA/Hibernate + Pessimistic Locking** — Prevents race conditions during high-demand ticket sales
* **MapStruct + Lombok** — Clean, maintainable architecture
* **PostgreSQL** — Scalable relational persistence
* **ZXing** — QR generation & validation engine

### 🎨 Modern Frontend

* **React + TypeScript** — Strongly typed UI architecture
* **Vite** — Ultra-fast builds and HMR
* **Tailwind CSS + Shadcn UI** — Professional UI system
* **React Router v7** — Structured routing
* **OIDC Client** — Seamless auth integration
* **QR Scanner** — Camera-based validation interface

### 🔐 Security & Identity

* Centralized identity provider integration
* Role-Based Access Control
  `ORGANIZER | ATTENDEE | STAFF`
* Stateless JWT session handling
* Route-level frontend + backend protection

---

## 🎯 Core Features

### 📅 Event Management

* Dynamic event creation with flexible ticket tiers
* Status lifecycle: `Draft → Published → Completed`
* Smart date/time configuration UI
* Venue capacity management

### 🎫 Ticketing System

* Multi-tier pricing and availability logic
* Concurrency-safe booking
* Unique QR per ticket
* Mock payment workflow

### 📱 Validation System

* Camera-based scanning interface
* Instant validation status
* Manual fallback entry
* Cross-device validation support

### 👥 User Experience

* Built-in demo accounts
* Role-based user manuals
* Fully responsive UI
* Smooth interaction flows

---

## 🛠 Technical Implementation

### 🔄 Concurrency Control

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
Optional<TicketType> findByIdWithLock(@Param("id") UUID id);
```

Ensures consistent ticket inventory during simultaneous purchases.

### 🎯 Clean Architecture

* DTO + mapper abstraction
* Service-layer business logic
* Repository-layer persistence
* Controller REST interface layer

### 🐳 Containerization

* Multi-stage Docker builds
* Compose-based local environment
* Production-ready container configs

---

## ⚡ Quick Start

### 📋 Prerequisites

* Java 21+
* Node.js 18+
* Docker + Docker Compose

---

### ▶ Local Development

**1 — Start Infrastructure**

```bash
docker-compose up -d
```

Services:

* PostgreSQL → 5432
* Adminer → 8888
* Auth Server → 9090

---

**2 — Configure Auth**

```
http://localhost:9090
```

Create:

* Realm → `event-ticket-platform`
* Client → `event-ticket-platform-app`
* Roles → ORGANIZER, ATTENDEE, STAFF

---

**3 — Run Backend**

```bash
./mvnw spring-boot:run
```

API → `http://localhost:8080`

---

**4 — Run Frontend**

```bash
cd front-end
npm install
npm run dev
```

UI → `http://localhost:5173`

---

## 🔑 Demo Accounts

| Role      | Username  | Password | Access           |
| --------- | --------- | -------- | ---------------- |
| Organizer | organizer | password | Manage events    |
| Attendee  | attendee  | password | Buy tickets      |
| Staff     | staff     | password | Validate tickets |

---

## ☁️ Production Deployment

### Database

* Create hosted PostgreSQL instance
* Add connection string to environment variables

### Backend Hosting

```
DATABASE_URL=<postgres-url>
KEYCLOAK_ISSUER_URI=<issuer>
JAVA_OPTS=-Xmx256m -XX:+UseG1GC
```

Includes health checks + auto deployment config.

### Frontend Hosting

```
npm run build
VITE_KEYCLOAK_URL=<auth-url>
```

---

## 📊 Project Metrics

* **34+ backend classes**
* **15+ APIs**
* **12+ UI components**
* **8+ routes**
* Auth + RBAC + JWT implementation
* Optimized builds + caching
* Integration testing with H2 database

---

## 🏆 Technical Highlights

✔ Enterprise authentication system
✔ Concurrency-safe booking logic
✔ Production-ready deployment setup
✔ Clean architecture layering
✔ Scalable infrastructure design
✔ Professional UX system

---

## 🔗 Links

**Live Demo:** `[https://event-ticket-platform-three.vercel.app/]`
**Source Code:** `[https://github.com/AnjeshDash/Event-Ticket-Platform]`

---

### 👨‍💻 Author

**Anjesh Ranjan Dash**
Full Stack Engineer
