// src/components/scorecard/SyncStatsButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { syncGameStatsToPlayerStats } from '@/lib/supabase-queries';
import { BarChart3, Loader2 } from 'lucide-react';

interface SyncStatsButtonProps {
  gameId: number;
  onSynced: () => void;
}

export function SyncStatsButton({ gameId, onSynced }: SyncStatsButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    if (!confirm('¿Sincronizar las estadísticas de este juego? Esto actualizará las estadísticas totales de cada jugador.')) {
      return;
    }

    setLoading(true);
    try {
      await syncGameStatsToPlayerStats(gameId);
      alert('✅ Estadísticas sincronizadas exitosamente');
      onSynced();
    } catch (error) {
      console.error('Error syncing stats:', error);
      alert('Error al sincronizar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={loading}
      className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Sincronizando...
        </>
      ) : (
        <>
          <BarChart3 className="w-4 h-4" />
          Sincronizar Stats
        </>
      )}
    </Button>
  );
}