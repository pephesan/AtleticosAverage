// src/components/admin/AddPlayerDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addPlayer, addPlayerStats } from '@/lib/supabase-queries';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function AddPlayerDialog() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    position: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Crear jugador
      const newPlayer = await addPlayer({
        name: formData.name,
        number: parseInt(formData.number),
        position: formData.position,
      });

      // 2. Crear estadísticas iniciales en 0
      await addPlayerStats({
        player_id: newPlayer.id,
        games_played: 0,
        at_bats: 0,
        hits: 0,
        doubles: 0,
        triples: 0,
        home_runs: 0,
        rbi: 0,
        walks: 0,
        strikeouts: 0,
        stolen_bases: 0,
        batting_average: 0,
        on_base_percentage: 0,
        slugging_percentage: 0,
      });

      // 3. Resetear form y cerrar
      setFormData({ name: '', number: '', position: '' });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error agregando jugador:', error);
      alert('Error al agregar jugador');
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
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar Jugador
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Jugador</DialogTitle>
          <DialogDescription>
            Completa la información del jugador. Las estadísticas se inicializarán en 0.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div>
            <Label htmlFor="number">Número de Jersey</Label>
            <Input
              id="number"
              type="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="10"
              required
              min="0"
              max="99"
            />
          </div>

          <div>
            <Label htmlFor="position">Posición</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData({ ...formData, position: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona posición" />
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
              {loading ? 'Guardando...' : 'Agregar Jugador'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}