import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Layers, AlertCircle, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '#/context/AuthContext';
import { collection, onSnapshot, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '#/services/firebase';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryTickets = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(queryTickets, (snapshot) => {
      const ticketList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketList);
      setLoading(false);
    }, (error) => {
      console.error('Error when getting tickets:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Função para assumir o chamado
  const handleAssignTicket = async (e, ticketId) => {
    e.stopPropagation(); // Evita disparar o clique do card que abre o detalhe
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        status: 'in-progress',
        agentId: currentUser.uid,
        agentEmail: currentUser.email
      });
    } catch (error) {
      console.error("Error when assigning the ticket to an agent: ", error);
    }
  };

  // Métricas dinâmicas calculadas com base no array de tickets
  const unassignedCount = tickets.filter(t => t.status === 'Open' || t.status === 'open').length;
  const activeCount = tickets.filter(t => t.status === 'In Progress' || t.status === 'in-progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Closed' || t.status === 'closed').length;

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading agent dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Topo / Título */}
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Agent Helpdesk Queue</h1>
        <p className="text-zinc-400 text-sm mt-1">Monitor, assign, and resolve incoming client support requests in real-time.</p>
      </div>

      {/* Grid de Métricas Dinâmicas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-zinc-900/30 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Unassigned</CardTitle>
            <AlertCircle className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-zinc-100">{unassignedCount}</div>
            <p className="text-xs text-zinc-500 mt-1">Tickets waiting for an agent</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Chats</CardTitle>
            <Clock className="size-4 text-amber-400" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-zinc-100">{activeCount}</div>
            <p className="text-xs text-zinc-500 mt-1">Tickets being handled right now</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Resolved Tickets</CardTitle>
            <CheckCircle2 className="size-4 text-blue-400" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-zinc-100">{resolvedCount}</div>
            <p className="text-xs text-zinc-500 mt-1">Successfully closed requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção da Fila Global */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Active Support Tickets Queue</h2>
        
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20">
          {tickets.length === 0 ? (
            <p className="text-center text-zinc-500 py-12">No tickets found in the system.</p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {tickets.map((ticket) => {
                const isOpen = ticket.status === 'Open' || ticket.status === 'open';
                const isInProgress = ticket.status === 'In Progress' || ticket.status === 'in-progress';

                return (
                  <div 
                    key={ticket.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                  >
                    {/* Informações da Esquerda: Usuário, Prioridade e Título */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                          {ticket.client || ticket.clientEmail || 'Client'}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {ticket.createdAt 
                            ? new Date(ticket.createdAt.seconds * 1000).toLocaleDateString() 
                            : 'Recent'}
                        </span>
                        
                        {ticket.priority && (
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                            ticket.priority === 'Critical' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                            ticket.priority === 'High' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                            'text-zinc-400 border-zinc-700 bg-zinc-800/10'
                          }`}>
                            {ticket.priority}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-zinc-200 transition-colors">
                        {ticket.title}
                      </h3>
                    </div>

                    {/* Informações da Direita: Status e Botão de Ação */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        isOpen ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        isInProgress ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-zinc-800/20 text-zinc-400 border-zinc-700'
                      }`}>
                        {isOpen ? <AlertCircle className="size-3" /> : <Clock className="size-3" />}
                        {ticket.status}
                      </span>

                      {/* Botão para Assumir Chamado caso esteja aberto */}
                      {isOpen ? (
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8"
                          onClick={(e) => handleAssignTicket(e, ticket.id)}
                        >
                          Assumir Chamado
                        </Button>
                      ) : (
                        <span className="text-xs text-zinc-500 max-w-[140px] truncate" title={ticket.agentEmail}>
                          {ticket.agentEmail ? `Atribuído a ${ticket.agentEmail.split('@')[0]}` : 'Em atendimento'}
                        </span>
                      )}
                      
                      <ChevronRight className="size-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all hidden sm:block" />
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}