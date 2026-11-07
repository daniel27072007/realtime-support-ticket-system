import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '#/components/ui/button';
import { LogOut, Ticket } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '#/services/firebase';

export default function Header() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate("/login")
    } catch (error) {
      console.error("Error when doing logout:", error)
    }
  }

  return (
    <header className="w-full border-b border-white-800 bg-zinc-900/50 backdrop-blur-sm px-6 py-4 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Lado Esquerdo: Logo e Nome */}
        <div className="flex items-center gap-2">
          <Ticket className="size-5 text-blue-500" />
          <span className="font-bold tracking-tight text-lg">RealtimeSupport</span>
        </div>

        {/* Lado Direito: Ações / Logout */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2 text-sm"
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>

      </div>
    </header>
  );
}