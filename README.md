# 🎫 Event Ticket Management Platform

**A comprehensive full-stack event management platform** built with modern technologies and enterprise-grade architecture. Features secure authentication, real-time QR validation, and scalable ticketing workflows.

---

## 🚀 Architecture Overview

### 🏗 Backend Technology Stack

* **Spring Boot + Java 21** — Modern JVM ecosystem
* **Spring Security + OAuth2/JWT** — Enterprise-grade authentication  
* **JPA/Hibernate + Pessimistic Locking** — Prevents race conditions during ticket sales
* **MapStruct + Lombok** — Clean, maintainable architecture
* **PostgreSQL** — Scalable relational persistence
* **ZXing** — QR generation & validation engine

### 🎨 Frontend Technology Stack

* **React + TypeScript** — Strongly typed UI architecture
* **Vite** — Ultra-fast builds and hot module replacement
* **Tailwind CSS + Shadcn UI** — Professional design system
* **React Router v7** — Structured routing
* **OIDC Client** — Seamless authentication integration
* **QR Scanner** — Camera-based validation interface

### 🔐 Security & Authentication

* Centralized identity provider integration
* Role-Based Access Control: `ORGANIZER | ATTENDEE | STAFF`
* Stateless JWT session handling
* Route-level frontend and backend protection

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
* Unique QR code per ticket
* Mock payment workflow

### 📱 Validation System

* Camera-based scanning interface
* Instant validation status
* Manual fallback entry
* Cross-device validation support

### 👥 User Experience

* Built-in demo accounts
* Role-based user manuals
* Fully responsive design
* Smooth interaction flows

---

## 🛠 Technical Implementation

### 🔄 Concurrency Control

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
Optional<TicketType> findByIdWithLock(@Param("id") UUID id);
```

Ensures consistent ticket inventory during simultaneous purchases.

### � Clean Architecture

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

**2 — Configure Authentication**

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

## 🌐 Production Deployment

### Database

* Create hosted PostgreSQL instance
* Add connection string to environment variables

### Backend Deployment

```
DATABASE_URL=<postgres-url>
KEYCLOAK_ISSUER_URI=<issuer>
JAVA_OPTS=-Xmx256m -XX:+UseG1GC
```

Includes health checks + auto deployment configuration.

### Frontend Deployment

```
npm run build
VITE_KEYCLOAK_URL=<auth-url>
```

---

## 📊 Project Statistics

* **34+ backend classes**
* **15+ REST APIs**
* **12+ UI components**
* **8+ application routes**
* Authentication + RBAC + JWT implementation
* Optimized builds + caching
* Integration testing with H2 database

---

## 🏆 Technical Achievements

✅ Enterprise authentication system
✅ Concurrency-safe booking logic
✅ Production-ready deployment setup
✅ Clean architecture layering
✅ Scalable infrastructure design
✅ Professional user experience

---

## 🔗 Project Links

**Live Demo:** `[https://event-ticket-platform-three.vercel.app/]`
**Source Code:** `[https://github.com/AnjeshDash/Event-Ticket-Platform]`

---

## 👨‍💻 Author

**Anjesh Ranjan Dash**

Full Stack Developer | Event Management Platform
