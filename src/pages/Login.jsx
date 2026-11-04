import React from 'react';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <p className="text-zinc-400 text-center mb-4">Welcome back to the platform.</p>
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium transition-colors">
          Access Dashboard
        </button>
      </div>
    </div>
  );
}
