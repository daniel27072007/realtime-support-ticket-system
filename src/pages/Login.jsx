import React from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const navigate = useNavigate()

  const onSubmitLogin = (event) => {
    event.preventDefault
    navigate('/client-dashboard')
  }

  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-sm">
        
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-zinc-400">Enter your credentials to access your support panel</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmitLogin}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                Email address
              </label>
            </div>
            <Input id="email" type="email" placeholder="name@example.com" className="bg-zinc-950 border-zinc-800" required />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                Password
              </label>
            </div>
            <Input id="password" type="password" placeholder="••••••••" className="bg-zinc-950 border-zinc-800 tracking-[0.4em]" required />

          </div>

          <Button type="submit" className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold h-10 transition-colors">
            Sign In
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-500">Don't have an account? </span>
          <button onClick={() => navigate('/register')} className="font-medium text-white hover:underline underline-offset-4">
            Create an account
          </button>
        </div>

      </div>
    </div>
  );
}