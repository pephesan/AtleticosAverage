// src/components/admin/AddGameDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addGame } from '@/lib/supabase-queries';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export function AddGameDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    opponent: '',
    location: '' as 'home' | 'away' | '',
    score_us: '',
    score_them: '',
    result: '' as 'W' | 'L' | 'T' | '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addGame({
        date: formData.date,
        opponent: formData.opponent,
        location: formData.location as 'home' | 'away',
        score_us: parseInt(formData.score_us),
        score_them: parseInt(formData.score_them),
        result: formData.result as 'W' | 'L' | 'T',
      });

      setFormData({
        date: '',
        opponent: '',
        location: '',
        score_us: '',
        score_them: '',
        result: '',
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error agregando juego:', error);
      alert('Error al agregar juego');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Registrar Juego
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Juego</DialogTitle>
          <DialogDescription>
            Completa la información del juego
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="opponent">Oponente</Label>
            <Input
              id="opponent"
              value={formData.opponent}
              onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
              placeholder="Toros"
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Ubicación</Label>
            <Select
              value={formData.location}
              onValueChange={(value: 'home' | 'away') => setFormData({ ...formData, location: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">🏠 Local</SelectItem>
                <SelectItem value="away">✈️ Visitante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="score_us">Nuestra Puntuación</Label>
              <Input
                id="score_us"
                type="number"
                value={formData.score_us}
                onChange={(e) => setFormData({ ...formData, score_us: e.target.value })}
                placeholder="0"
                required
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="score_them">Puntuación Rival</Label>
              <Input
                id="score_them"
                type="number"
                value={formData.score_them}
                onChange={(e) => setFormData({ ...formData, score_them: e.target.value })}
                placeholder="0"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="result">Resultado</Label>
            <Select
              value={formData.result}
              onValueChange={(value: 'W' | 'L' | 'T') => setFormData({ ...formData, result: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona resultado" />
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
              {loading ? 'Guardando...' : 'Registrar Juego'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}