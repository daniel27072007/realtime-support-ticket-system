import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card';
import { PlusCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ClientDashboard() {
  const navigate = useNavigate();

  // Lista de tickets fictícios para popular o nosso esqueleto visual
  const mockTickets = [
    {
      id: 'ticket-101',
      title: 'Database connection drop error',
      category: 'Backend',
      status: 'In Progress',
      date: 'Nov 05, 2026',
    },
    {
      id: 'ticket-102',
      title: 'Payment checkout screen freeze on mobile',
      category: 'Frontend',
      status: 'Open',
      date: 'Nov 05, 2026',
    },
    {
      id: 'ticket-103',
      title: 'Firebase environment keys setup help',
      category: 'DevOps',
      status: 'Closed',
      date: 'Nov 02, 2026',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Topo do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Support Tickets</h1>
          <p className="text-zinc-400 text-sm mt-1">Create new requests or trace the progress of active ones in realtime.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium h-10 gap-2 px-4 shadow-lg shadow-blue-600/10">
          <PlusCircle className="size-4" />
          Create New Ticket
        </Button>
      </div>

      {/* Grid contendo a lista de chamados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTickets.map((ticket) => (
          <Card 
            key={ticket.id} 
            className="transition-all cursor-pointer group"
            onClick={() => navigate(`/ticket/${ticket.id}`)}
          >
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {ticket.category}
                </span>
                
                {/* Tag de status simulada baseada na condicional */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  ticket.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  ticket.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                }`}>
                  {ticket.status === 'Open' && <AlertCircle className="size-3" />}
                  {ticket.status === 'In Progress' && <Clock className="size-3" />}
                  {ticket.status === 'Closed' && <CheckCircle2 className="size-3" />}
                  {ticket.status}
                </span>
              </div>
              
              <CardTitle className="text-lg font-bold group-hover:text-white-400 transition-colors pt-1">
                {ticket.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-zinc-400 line-clamp-2">
                Click to open the chat timeline and discuss this issue directly with an active technical support agent.
              </p>
            </CardContent>

            <CardFooter className="pt-4 text-xs text-zinc-500 flex justify-between items-center">
              <span>ID: {ticket.id}</span>
              <span>Updated {ticket.date}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

    </div>
  );
}