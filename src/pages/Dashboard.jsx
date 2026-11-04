import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Support Dashboard</h1>
        <p className="text-zinc-400">Manage all active tickets in real-time.</p>
        <div className="mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <p className="text-zinc-300">Ticket overview and list will be rendered here.</p>
        </div>
      </div>
    </div>
  );
}