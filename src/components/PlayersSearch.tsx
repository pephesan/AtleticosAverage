// src/components/PlayersSearch.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function PlayersSearch() {
  const [search, setSearch] = useState('');

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar jugador por nombre, número o posición..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-12 h-14 text-lg border-2 focus:border-blue-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg"
      />
    </div>
  );
}