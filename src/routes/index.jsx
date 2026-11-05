import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ClientDashboard from '../pages/ClientDashboard';
import AgentDashboard from '../pages/AgentDashboard';
import TicketDetail from '../pages/TicketDetail';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Criamos um componente de Layout simples para envelopar o cabeçalho e o rodapé nas páginas internas
function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas (Sem Header e Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas Internas (Envelopadas com o AppLayout) */}
        <Route path="/client-dashboard" element={<AppLayout><ClientDashboard /></AppLayout>} />
        <Route path="/agent-dashboard" element={<AppLayout><AgentDashboard /></AppLayout>} />
        <Route path="/ticket/:id" element={<AppLayout><TicketDetail /></AppLayout>} />

        {/* Rota de Fallback - Redireciona qualquer URL desconhecida para o login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}