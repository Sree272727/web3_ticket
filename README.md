# TCS Platform - Proof of Concept

A React-based proof-of-concept for **The Compliance Store (TCS)** — a SaaS platform for managing compliance in long-term care (LTC) healthcare facilities.

## Prerequisites

- **Node.js** (v16 or higher) — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sree272727/web3_ticket.git
cd web3_ticket
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will open at **http://localhost:3001** in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3001 |
| `npm run build` | Create production build in `/build` folder |
| `npm test` | Run test suite |

## Platform Modules

| Module | Route | Description |
|--------|-------|-------------|
| **Support Portal** | `/support` | Ticketing system with AI resolution markers, filters, and ticket detail drawer |
| **Notification Center** | `/notifications` | Compliance alerts, training reminders, document updates, and system notices |
| **Admin Console** | `/admin` | AI Insights, company management with subscriber bundles, user administration, and audit log |
| **Reporting Dashboard** | `/reporting` | Interactive charts — AI resolution split, tickets by module, facility trends, status breakdown, resolution times, and self-service candidates |

## Persona Switcher

Use the persona dropdown in the top-right corner to switch between different user roles:

| Persona | Description | Data Scope |
|---------|-------------|------------|
| **TCS Admin** | Platform super admin | All data across all facilities |
| **TCS Employee** | Support/operations user | All data (read-only on some features) |
| **Account Manager** | Relationship owner | Assigned facilities only |
| **Customer Admin** | Facility administrator | Own facility only |
| **Customer Employee** | Facility staff | Own submitted tickets only |

## Tech Stack

- **React 18** with hooks and context API
- **React Router v6** for client-side routing
- **React Icons** (Feather icons)
- **CSS Custom Properties** for theming
- All data is mocked locally (no backend required)
