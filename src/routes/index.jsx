import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ClientDashboard from '../pages/ClientDashboard';
import AgentDashboard from '../pages/AgentDashboard';
import TicketDetail from '../pages/TicketDetail';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '#/context/AuthContext';
import PrivateRoute from '#/routes/PrivateRoute'

// Geral component that says to his children to be in a div with the header and footer components
function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes (With AppLayout)*/}
          <Route path="/client-dashboard" element={<PrivateRoute allowedRole="client"><AppLayout><ClientDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/agent-dashboard" element={<PrivateRoute allowedRole="agent"><AppLayout><AgentDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/ticket/:id" element={<PrivateRoute><AppLayout><TicketDetail /></AppLayout></PrivateRoute>} />

          {/* Fallback Route - any unknown url fall into this */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}