# Realtime Support Ticket System (BaaS & WebSockets Engine)
**A real-time multi-user helpdesk platform built with Firebase BaaS, real-time ticket queue management, and role-based client/agent dashboards.**

A modern, responsive real-time helpdesk architecture built with **React 19**, **Vite**, **Firebase (Authentication & Firestore)**, and **Tailwind CSS v4** with **Shadcn UI**. It demonstrates end-to-end customer support management—from user registration and role assignment (Client vs. Support Agent) to real-time ticket creation, dynamic agent queue assignment, live bidirectional ticket messaging, and status lifecycle tracking.

---

## The Problem
Building real-time support systems and multi-user chat applications presents significant synchronization, access control, and state management challenges:
* **Stale Queue & Live Updates Delay:** Traditional HTTP polling results in delayed support responses and high server load, preventing agents from seeing incoming tickets or message updates immediately.
* **Role Misalignment & Access Control Gaps:** Failing to segregate routing and permissions between clients and support agents can lead to unauthorized ticket manipulation or security leaks across user boundaries.
* **Concurrent Agent Handover Issues:** Simultaneous agent operations on unassigned tickets often lead to race conditions where multiple agents claim the same issue or tickets remain unmonitored.
* **Disconnected Chat Context & State Drift:** When ticket statuses change (e.g., marked as closed), client interfaces often allow continued message dispatching if state updates fail to sync in real time.

---

## The Solution
This application delivers a lightweight, real-time helpdesk architecture centered on event-driven Firestore listeners (`onSnapshot`), strict route authorization based on user roles, and an interactive dual-dashboard design.

### What this system automatically handles for you:
* **Role-Based Authentication & Navigation:** Enforces automatic post-login and guard routing (`PrivateRoute`) based on stored Firestore roles (`client` vs. `agent`), keeping users strictly inside their dedicated workflows.
* **Live Ticket Queue Synchronization:** Listens to Firestore ticket collections in real time, immediately reflecting new submissions, priority levels, and unassigned metrics on the Agent Helpdesk Queue.
* **Atomic Ticket Assignment:** Allows support agents to assign open tickets to themselves with a single click, instantly updating status markers to `in-progress` across all active client and agent sessions.
* **Real-time Bidirectional Chat Timeline:** Listens to subcollection message feeds per ticket ID, streaming incoming messages instantaneously for both clients and agents without manual page refreshes.
* **Automated Closed Ticket Guard:** Dynamically locks message input controls and displays a read-only lock banner as soon as a ticket status transitions to `Closed`.
* **Dynamic Plan & Metrics Tracking:** Computes total unassigned, active, and resolved tickets on the fly to give agents high-level metrics on overall support workload.

---

## Interface Specifications & Technical Walkthrough
This section outlines how user authentication payloads, Firestore data structures, and role permissions are organized across the platform.

### 1. Database Schema & User Domain Topology
The system uses Firebase Firestore with top-level collections for users and tickets, alongside a nested subcollection for real-time ticket messages.

#### User Domain Model (`users/{uid}`)
* **Identity Fields:** Unique String `username`, unique String `email`, and Timestamp `createdAt`.
* **Role Constraint:** Restricted enum string (`'client' | 'agent'`).

```json
{
  "username": "Alex Developer",
  "email": "alex@example.com",
  "role": "client",
  "createdAt": "2026-11-09T18:00:00.000Z"
}
```

#### Support Ticket Schema (`tickets/{ticketId}`)
* **Ticket Metadata:** String `title`, String `description`, String `category` (`'Backend' | 'Frontend' | 'DevOps' | 'Database'`), String `priority` (`'Low' | 'Medium' | 'High' | 'Critical'`).
* **State & Assignment:** String `status` (`'Open' | 'In Progress' | 'Closed'`), String `clientId`, String `clientName`, nullable String `agentId`, and nullable String `agentEmail`.

```json
{
  "_id": "tK98zL0PqRstUVw",
  "title": "Database connection drop error",
  "description": "API fails to connect to database during high traffic.",
  "category": "Database",
  "priority": "High",
  "status": "in-progress",
  "clientId": "usr_client_123",
  "clientName": "client@example.com",
  "agentId": "usr_agent_999",
  "agentEmail": "agent@example.com",
  "createdAt": "2026-11-09T18:10:00.000Z"
}
```

#### Nested Message Subcollection (`tickets/{ticketId}/messages/{messageId}`)
* **Message Properties:** String `text`, String `senderId`, String `senderName`, String `senderRole` (`'client' | 'agent'`), and Timestamp `createdAt`.

```json
{
  "_id": "msg_45678",
  "text": "We are investigating the connection pool limits now.",
  "senderId": "usr_agent_999",
  "senderName": "agent",
  "senderRole": "agent",
  "createdAt": "2026-11-09T18:15:00.000Z"
}
```

### 2. Role-Based Access Control (RBAC) Architecture
The frontend router enforces strict access rules via the custom `PrivateRoute` component wrapper:
* **Client Role:** Access restricted to `/client-dashboard` and owned ticket detail timelines (`/ticket/:id`). Can create new tickets and submit messages to open tickets.
* **Agent Role:** Access restricted to `/agent-dashboard` and any ticket detail timeline (`/ticket/:id`). Can view global support queues, claim open tickets, alter ticket statuses (`Open`, `In Progress`, `Closed`), and respond to support queries.

```javascript
// React Guard (PrivateRoute.jsx)
export default function PrivateRoute({ children, allowedRole }) {
  const { currentUser, role, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "agent" ? "/agent-dashboard" : "/client-dashboard"} replace />;
  }
  return children;
}
```

---

## Project Architecture
```text
realtime-support-ticket-system/
├── public/                   # Static assets (favicons, SVG icons)
├── src/
│   ├── components/           # Shared layout components & UI library
│   │   ├── ui/               # Base UI primitive components (button, card, input)
│   │   ├── Footer.jsx        # Standard platform footer
│   │   └── Header.jsx        # Navigation header with session logout control
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth listener & role provider context
│   ├── lib/
│   │   └── utils.js          # Tailwind class merger helpers (cn)
│   ├── pages/
│   │   ├── AgentDashboard.jsx# Helpdesk queue, dynamic counters, and ticket claim actions
│   │   ├── ClientDashboard.jsx# Client ticket grid & new ticket creation modal
│   │   ├── Login.jsx         # User login screen with role redirection
│   │   ├── Register.jsx      # Account creation with role selection (Client/Agent)
│   │   └── TicketDetail.jsx  # Real-time WebSocket/Firestore chat room & status management
│   ├── routes/
│   │   ├── index.jsx         # App router layout configuration
│   │   └── PrivateRoute.jsx  # Authentication and RBAC route protection guard
│   ├── services/
│   │   └── firebase.js       # Firebase Auth and Firestore SDK configuration & queries
│   ├── App.jsx               # Main application component
│   ├── index.css             # Tailwind v4 configuration & base theme styles
│   └── main.jsx              # Application entry point with React StrictMode
├── .env.local                # Firebase API credentials
├── components.json           # Shadcn UI configuration file
├── package.json              # Project dependencies & build scripts
├── README.md                 # System documentation
└── vite.config.js            # Vite build configuration & path alias setups
```

---

## Installation & Local Deployment Guide
To run this application locally, ensure you have **Node.js** installed, then follow the steps below.

### 1. Configure Environment Variables
Create a `.env.local` file inside the root directory with your Firebase Web project credentials:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Multi-User Testing Workflow
To verify real-time synchronous behavior end-to-end:
1. Open a normal browser tab and navigate to `http://localhost:5173`. Register a **Client** account and create a support ticket.
2. Open an Incognito browser window, register an **Agent** account, and access `/agent-dashboard`.
3. Observe the newly created ticket appearing instantly on the agent queue without refreshing. Click **Assumir Chamado** to claim it, open the chat room in both tabs, and test live real-time messaging.

---

## Ecosystem Breakdown

| System Element | Core Tool | Architectural Edge |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 / Vite | Lightning-fast HMR bundled with modern React features. |
| **Backend as a Service** | Firebase Firestore | Native WebSocket synchronization through `onSnapshot` listeners. |
| **Authentication System** | Firebase Auth | Secure token management and session persistence. |
| **Styling Engine** | Tailwind CSS v4 | Clean dark-mode utility-first styling with custom CSS variables. |
| **UI Components** | Base UI / Lucide React | Accessible, lightweight UI components and consistent iconography. |
| **Routing & Protection** | React Router v7 | Seamless single-page app navigation backed by role-aware route guards. |

---

## Final Comparison Matrix: Architecture vs Tradition

| Feature Attribute | Traditional REST Approach | Realtime BaaS Pipeline |
| :--- | :--- | :--- |
| **Data Synchronization** | Requires manual refresh or periodic polling intervals, straining network resources. | Uses live Firestore WebSocket snapshots for zero-latency UI updates across all clients. |
| **Ticket Handover** | Delayed visibility of agent assignment, risking duplicate work on open tickets. | Instant state mutation updates queue views across all connected agent dashboards in real time. |
| **Chat Timeline** | Dependent on continuous API polling to fetch new ticket responses. | Streams subcollection message documents in real time as soon as they are written to the database. |
| **Access Enforcement** | Relies solely on client-side state flags, susceptible to route tampering. | Protects routes dynamically through combined Auth state checks and Firestore role lookups. |
| **Closed State Handling** | Allows users to send orphan messages if client cache is out of date. | Real-time state listeners immediately disable chat forms and show lock banners across all open sessions. |