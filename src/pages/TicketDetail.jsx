import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { ArrowLeft, Send, Clock, User, Shield, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '#/context/AuthContext';
import { subscribeTicketMessages, subscribeTickets, sendMessages, updateTicketStatus } from '#/services/firebase';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, role } = useAuth()

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  //when the url changes the id we open a listener for those messages and that ticket
  //then always updating the useState varible to have the realtime information
  useEffect(() => {
    if (!id) return;
    const unsubscribeTicket = subscribeTickets(id, (ticketData) => {
      setTicket(ticketData);
    });
    const unsubscribeMessages = subscribeTicketMessages(id, (messagesData) => {
      setMessages(messagesData);
      setLoading(false);
    });
    return () => {
      if (unsubscribeTicket) unsubscribeTicket();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [id]);

  //function to update ticket status
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setUpdatingStatus(true);
    try {
      await updateTicketStatus(id, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  //function to send the messages
  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessages(id, {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: currentUser.email.split('@')[0],
        senderRole: role || 'client',
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center text-zinc-400">
        <p className="animate-pulse">Loading real-time chat...</p>
      </div>
    );
  }

  const isOpen = ticket.status === 'Open' || ticket.status === 'open';
  const isInProgress = ticket.status === 'In Progress' || ticket.status === 'in-progress';
  const isClosed = ticket.status === 'Closed' || ticket.status === 'closed';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 h-[calc(100vh-140px)] flex flex-col">
      
      {/* 1. Topo: Cabeçalho com controle dinâmico de status */}
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
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">{ticket.title}</h1>
              
              {/* Se o utilizador for AGENTE, permite alterar o status por um Select */}
              {role === 'agent' ? (
                <select
                  value={ticket.status}
                  onChange={handleStatusChange}
                  disabled={updatingStatus}
                  className={`text-xs font-medium border px-2 py-0.5 rounded-full outline-none transition-colors cursor-pointer ${
                    isOpen ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    isInProgress ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  <option value="Open" className="bg-zinc-900 text-zinc-200">Open</option>
                  <option value="In Progress" className="bg-zinc-900 text-zinc-200">In Progress</option>
                  <option value="Closed" className="bg-zinc-900 text-zinc-200">Closed</option>
                </select>
              ) : (
                /* Se for CLIENTE, exibe apenas a Badge informativa */
                <span className={`text-[10px] border px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${
                  isOpen ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  isInProgress ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                }`}>
                  {isClosed ? <CheckCircle2 className="size-2.5" /> : <Clock className="size-2.5" />}
                  {ticket.status}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              ID: {id} &bull; Category: {ticket.category || 'General'} &bull; Priority: {ticket.priority || 'Low'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Centro: Área de mensagens */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-zinc-800">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No messages yet. Start the conversation below!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.uid;
            const isAgent = msg.senderRole === 'agent';

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1 px-1">
                  {isAgent ? (
                    <>
                      <span className="font-medium text-blue-400">{msg.senderName}</span>
                      <Shield className="size-3 text-blue-400" />
                    </>
                  ) : (
                    <>
                      <User className="size-3" />
                      <span className="font-medium">{msg.senderName}</span>
                    </>
                  )}
                </div>

                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md border ${
                  isMe 
                    ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                    : 'bg-zinc-900/60 text-zinc-200 border-zinc-800 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                  <span className="block text-[10px] mt-1.5 text-right opacity-60">
                    {msg.createdAt?.seconds 
                      ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : 'Just now'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Rodapé: Formulário de envio OU Banner de Ticket Fechado */}
      {isClosed ? (
        <div className="flex items-center justify-center gap-2 border-t border-zinc-800 pt-4 pb-2 text-zinc-400 text-sm bg-zinc-950 shrink-0">
          <Lock className="size-4 text-zinc-500" />
          <span>This support ticket has been closed. Sending new messages is disabled.</span>
        </div>
      ) : (
        <form 
          className="flex items-center gap-2 border-t border-zinc-800 pt-4 bg-zinc-950 shrink-0" 
          onSubmit={handleSendMessage}
        >
          <Input 
            type="text" 
            placeholder="Type your message in realtime..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="bg-zinc-900/40 border-zinc-800 h-10 flex-1 px-4 placeholder-zinc-500 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
          />
          <Button 
            type="submit" 
            disabled={sending}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium size-10 rounded-lg shrink-0 transition-colors shadow-md shadow-blue-600/10 cursor-pointer"
          >
            <Send className="size-4" />
          </Button>
        </form>
      )}

    </div>
  );
}