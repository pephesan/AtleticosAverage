// src/components/admin/EditPlayerDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updatePlayer } from '@/lib/supabase-queries';
import { useRouter } from 'next/navigation';
import { Edit } from 'lucide-react';
import { PlayerDB } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function EditPlayerDialog({ player }: { player: PlayerDB }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: player.name,
    number: player.number.toString(),
    position: player.position,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updatePlayer(player.id, {
        name: formData.name,
        number: parseInt(formData.number),
        position: formData.position,
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error actualizando jugador:', error);
      alert('Error al actualizar jugador');
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
          <DialogTitle>Editar Jugador</DialogTitle>
          <DialogDescription>
            Modifica la información del jugador
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nombre Completo</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-number">Número de Jersey</Label>
            <Input
              id="edit-number"
              type="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
              min="0"
              max="99"
            />
          </div>

          <div>
            <Label htmlFor="edit-position">Posición</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData({ ...formData, position: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P">P - Pitcher</SelectItem>
                <SelectItem value="C">C - Catcher</SelectItem>
                <SelectItem value="1B">1B - Primera Base</SelectItem>
                <SelectItem value="2B">2B - Segunda Base</SelectItem>
                <SelectItem value="3B">3B - Tercera Base</SelectItem>
                <SelectItem value="SS">SS - Shortstop</SelectItem>
                <SelectItem value="LF">LF - Left Field</SelectItem>
                <SelectItem value="CF">CF - Center Field</SelectItem>
                <SelectItem value="RF">RF - Right Field</SelectItem>
                <SelectItem value="DH">DH - Designated Hitter</SelectItem>
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