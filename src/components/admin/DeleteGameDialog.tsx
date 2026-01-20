// src/components/admin/DeleteGameDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteGame } from '@/lib/supabase-queries';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { GameDB } from '@/types';

export function DeleteGameDialog({ game }: { game: GameDB }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteGame(game.id);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error eliminando juego:', error);
      alert('Error al eliminar juego');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar juego?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará el juego vs{' '}
            <strong>{game.opponent}</strong> del {game.date}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Sí, eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}