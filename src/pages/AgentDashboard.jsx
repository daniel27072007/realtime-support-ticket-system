import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Layers, AlertCircle, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AgentDashboard() {
  const navigate = useNavigate();

  // Dados fictícios simulando a fila global de suporte que os técnicos atendem
  const globalTickets = [
    {
      id: 'ticket-101',
      client: 'Daniel',
      title: 'Database connection drop error',
      priority: 'High',
      status: 'In Progress',
      time: '12m ago',
    },
    {
      id: 'ticket-102',
      client: 'Lucas Ricci',
      title: 'Payment checkout screen freeze on mobile',
      priority: 'Critical',
      status: 'Open',
      time: '4m ago',
    },
    {
      id: 'ticket-104',
      client: 'Amanda',
      title: 'SaaS authentication token expiration bug',
      priority: 'Medium',
      status: 'Open',
      time: '1h ago',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Topo / Título */}
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Agent Helpdesk Queue</h1>
        <p className="text-zinc-400 text-sm mt-1">Monitor, assign, and resolve incoming client support requests in real-time.</p>
      </div>

      {/* Grid de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-zinc-900/30 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Unassigned</CardTitle>
            <AlertCircle className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="pb-6 px-6">
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-zinc-500 mt-1">Tickets waiting for an agent</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Chats</CardTitle>
            <Clock className="size-4 text-amber-400" />
          </CardHeader>
          <CardContent className="pb-6 px-6">
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-zinc-500 mt-1">Tickets being handled right now</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-zinc-400">Avg. Response Time</CardTitle>
            <Layers className="size-4 text-blue-400" />
          </CardHeader>
          <CardContent className="pb-6 px-6">
            <div className="text-3xl font-bold">4.2m</div>
            <p className="text-xs text-zinc-500 mt-1">Bidirectional sync efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção da Fila Global */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Active Support Tickets Fila</h2>
        
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20">
          <div className="divide-y divide-zinc-800">
            {globalTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                
                {/* Informações da Esquerda: Usuário e Título */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {ticket.client}
                    </span>
                    <span className="text-xs text-zinc-500">{ticket.time}</span>
                    
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                      ticket.priority === 'Critical' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                      ticket.priority === 'High' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                      'text-zinc-400 border-zinc-700 bg-zinc-800/10'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h3 className="font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">
                    {ticket.title}
                  </h3>
                </div>

                {/* Informações da Direita: Status e Ação */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    ticket.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {ticket.status === 'Open' ? <AlertCircle className="size-3" /> : <Clock className="size-3" />}
                    {ticket.status}
                  </span>
                  
                  <ChevronRight className="size-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all hidden sm:block" />
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}