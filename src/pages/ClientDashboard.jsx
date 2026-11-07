import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card';
import { PlusCircle, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '#/context/AuthContext';
import { subscribeClientTickets, createTicket } from '#/services/firebase';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth()
  
  //useStates and useEffect to read the user's tickets form db
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(!currentUser){
      return
    }
    const unsubscribe = subscribeClientTickets(currentUser.uid, (realTickets) => {
      setTickets(realTickets)
      setLoading(false)
    })
    return () => unsubscribe
  }, [currentUser])

  //useStates and functions to open the modal and create new ticket
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Backend',
    priority: 'Low',
    description: ''
  });

  // function the handle typing on the modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //function to send the new ticket to db
  const handleCreateTicket = async (event) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;
    setSubmitting(true);
    try {
      await createTicket({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'Open',
        clientId: currentUser.uid,
        clientName: currentUser.email,
        agentId: null
      });

      // Close the modal and cleans the formData
      setIsModalOpen(false);
      setFormData({ title: '', category: 'Backend', priority: 'Low', description: '' });
    } catch (error) {
      console.error("Error when creating ticket:", error);
    } finally {
      setSubmitting(false);
    }
  };


return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 relative">
      
      {/* Topo do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Support Tickets</h1>
          <p className="text-zinc-400 text-sm mt-1">Create new requests or trace the progress of active ones in realtime.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium h-10 gap-2 px-4 shadow-lg shadow-blue-600/10 cursor-pointer"
        >
          <PlusCircle className="size-4" />
          Create New Ticket
        </Button>
      </div>

      {/* Listagem de Tickets */}
      {loading ? (
        <p className="text-zinc-500 text-sm animate-pulse">Loading your tickets...</p>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 border border-zinc-800 rounded-xl bg-zinc-900/20">
          <p className="text-zinc-400 font-medium">You don't have any support tickets yet.</p>
          <p className="text-zinc-600 text-sm mt-1">Click on "Create New Ticket" to open your first request.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className="transition-all cursor-pointer group"
              onClick={() => navigate(`/ticket/${ticket.id}`)}
            >
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {ticket.category || 'General'}
                  </span>
                  
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    ticket.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    ticket.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                  }`}>
                    {ticket.status === 'Open' && <AlertCircle className="size-3" />}
                    {ticket.status === 'In Progress' && <Clock className="size-3" />}
                    {ticket.status === 'Closed' && <CheckCircle2 className="size-3" />}
                    {ticket.status || 'Open'}
                  </span>
                </div>
                
                <CardTitle className="text-lg font-bold group-hover:text-white transition-colors pt-1">
                  {ticket.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {ticket.description || 'Click to open the chat timeline...'}
                </p>
              </CardContent>

              <CardFooter className="pt-4 text-xs text-zinc-500 flex justify-between items-center">
                <span>ID: {ticket.id}</span>
                <span>{ticket.createdAt ? new Date(ticket.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* --- MODAL DE CRIAÇÃO DE CHAMADO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-6 text-white animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold tracking-tight">Create New Support Ticket</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              
              {/* Título */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300" htmlFor="title">
                  Issue Title *
                </label>
                <Input 
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ex: Database connection drop error"
                  className="bg-zinc-950 border-zinc-800"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Categoria e Prioridade (Grid duplo) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full h-8 rounded-lg border border-zinc-800 bg-zinc-950 px-2 text-sm text-zinc-300 outline-none focus:border-blue-500"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Database">Database</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="priority">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="w-full h-8 rounded-lg border border-zinc-800 bg-zinc-950 px-2 text-sm text-zinc-300 outline-none focus:border-blue-500"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300" htmlFor="description">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300 outline-none focus:border-blue-500 resize-none"
                  required
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4"
                >
                  {submitting ? "Creating..." : "Submit Ticket"}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}