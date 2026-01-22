// src/components/admin/EditGameDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateGame } from '@/lib/supabase-queries';
import { useRouter } from 'next/navigation';
import { Edit } from 'lucide-react';
import { GameDB } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function EditGameDialog({ game }: { game: GameDB }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: game.date,
    opponent: game.opponent,
    location: game.location,
    score_us: game.score_us.toString(),
    score_them: game.score_them.toString(),
    result: game.result || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateGame(game.id, {
        date: formData.date,
        opponent: formData.opponent,
        location: formData.location,
        score_us: parseInt(formData.score_us),
        score_them: parseInt(formData.score_them),
        result: formData.result as 'W' | 'L' | 'T',
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error actualizando juego:', error);
      alert('Error al actualizar juego');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Juego</DialogTitle>
          <DialogDescription>
            Modifica la información del juego
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-date">Fecha</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-opponent">Oponente</Label>
            <Input
              id="edit-opponent"
              value={formData.opponent}
              onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-location">Ubicación</Label>
            <Select
              value={formData.location}
              onValueChange={(value: 'home' | 'away') => setFormData({ ...formData, location: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">🏠 Local</SelectItem>
                <SelectItem value="away">✈️ Visitante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-score_us">Nuestra Puntuación</Label>
              <Input
                id="edit-score_us"
                type="number"
                value={formData.score_us}
                onChange={(e) => setFormData({ ...formData, score_us: e.target.value })}
                required
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="edit-score_them">Puntuación Rival</Label>
              <Input
                id="edit-score_them"
                type="number"
                value={formData.score_them}
                onChange={(e) => setFormData({ ...formData, score_them: e.target.value })}
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-result">Resultado</Label>
            <Select
              value={formData.result}
              onValueChange={(value: 'W' | 'L' | 'T') => setFormData({ ...formData, result: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="W">✅ Victoria (W)</SelectItem>
                <SelectItem value="L">❌ Derrota (L)</SelectItem>
                <SelectItem value="T">➖ Empate (T)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}