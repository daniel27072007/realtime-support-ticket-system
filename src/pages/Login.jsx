import React from 'react';
import { Button } from '#/components/ui/button';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <p className="text-zinc-400 text-center mb-6">Welcome back to the platform.</p>
        
        {/* Usando o componente oficial do Shadcn UI */}
        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
          Access Dashboard
        </Button>
      </div>
    </div>
  );
}