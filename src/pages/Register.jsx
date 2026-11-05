import React from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const onSubmitRegister = (e) => {
    e.preventDefault();
    // No futuro, aqui faremos a chamada de criação de conta no Firebase.
    navigate('/client-dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-white-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-sm">
        
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
          <p className="text-sm text-zinc-400">Get started with our realtime support ticket platform</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmitRegister}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="name">
              Full Name
            </label>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              className="bg-zinc-950 border-zinc-800" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="email">
              Email address
            </label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="bg-zinc-950 border-zinc-800" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
              Password
            </label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="bg-zinc-950 border-zinc-800 tracking-[0.4em]" 
              required 
            />
          </div>

          <Button type="submit" className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold h-10 transition-colors">
            Sign Up
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-500">Already have an account? </span>
          <button 
            onClick={() => navigate('/login')} 
            className="font-medium text-white hover:underline underline-offset-4"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
}