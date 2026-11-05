import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white-800 bg-zinc-950 py-4 px-6 text-center text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>&copy; 2026 RealtimeSupport Platform. All rights reserved.</p>
        <p className="text-zinc-600">Built for secure & fast helpdesk operations.</p>
      </div>
    </footer>
  );
}