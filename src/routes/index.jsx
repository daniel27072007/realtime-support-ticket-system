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
          <Route path="/client-dashboard" element={<AppLayout><ClientDashboard /></AppLayout>} />
          <Route path="/agent-dashboard" element={<AppLayout><AgentDashboard /></AppLayout>} />
          <Route path="/ticket/:id" element={<AppLayout><TicketDetail /></AppLayout>} />

          {/* Fallback Route - any unknown url fall into this */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}