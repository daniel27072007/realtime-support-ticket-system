import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { ArrowLeft, Send, Clock, User, Shield } from 'lucide-react';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dados fictícios simulando as mensagens em tempo real daquele ticket específico
  const mockMessages = [
    {
      id: 'msg-1',
      sender: 'client',
      name: 'Daniel',
      text: "Hi, I am experiencing a persistent connection drop on our main database cluster. It disconnects every 5 minutes.",
      time: '05:20 PM',
    },
    {
      id: 'msg-2',
      sender: 'agent',
      name: 'Support Agent',
      text: "Hello Daniel, thank you for reaching out. I am analyzing the cluster infrastructure logs right now. Did you apply any new environment keys recently?",
      time: '05:24 PM',
    },
    {
      id: 'msg-3',
      sender: 'client',
      name: 'Daniel',
      text: "No, the environment variables remain the same as last week. The issue started after the latest server migration patch.",
      time: '05:26 PM',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 h-[calc(100vh-140px)] flex flex-col">
      
      {/* 1. Topo: Cabeçalho com informações do chamado */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">Database connection drop error</h1>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                <Clock className="size-2.5" />
                In Progress
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">ID: {id || 'ticket-101'} &bull; Opened by Daniel</p>
          </div>
        </div>
      </div>

      {/* 2. Centro: Área de mensagens com rolagem e alinhamento flexbox */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-zinc-800">
        {mockMessages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
            >
              {/* Nome do remetente e ícone identificador */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1 px-1">
                {isAgent ? (
                  <>
                    <span className="font-medium text-blue-400">{msg.name}</span>
                    <Shield className="size-3 text-blue-400" />
                  </>
                ) : (
                  <>
                    <User className="size-3" />
                    <span className="font-medium">{msg.name}</span>
                  </>
                )}
              </div>

              {/* Balão da mensagem */}
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md border ${
                isAgent 
                  ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                  : 'bg-zinc-900/60 text-zinc-200 border-zinc-800 rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                <span className="block text-[10px] mt-1.5 text-right opacity-60">
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Rodapé: Caixa de texto de envio fixada abaixo */}
      <form 
        className="flex items-center gap-2 border-t border-zinc-800 pt-4 bg-zinc-950 shrink-0" 
        onSubmit={(e) => e.preventDefault()}
      >
        <Input 
          type="text" 
          placeholder="Type your message in realtime..." 
          className="bg-zinc-900/40 border-zinc-800 h-10 flex-1 px-4 placeholder-zinc-500 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
        />
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium size-10 rounded-lg shrink-0 transition-colors shadow-md shadow-blue-600/10"
        >
          <Send className="size-4" />
        </Button>
      </form>

    </div>
  );
}