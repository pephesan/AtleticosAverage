// src/components/admin/EditStatsDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePlayerStats } from '@/lib/supabase-queries';
import { useRouter } from 'next/navigation';
import { Edit } from 'lucide-react';
import { PlayerDB, PlayerStatsDB } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function EditStatsDialog({ player, stats }: { player: PlayerDB; stats: PlayerStatsDB }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    games_played: stats.games_played.toString(),
    at_bats: stats.at_bats.toString(),
    hits: stats.hits.toString(),
    doubles: stats.doubles.toString(),
    triples: stats.triples.toString(),
    home_runs: stats.home_runs.toString(),
    rbi: stats.rbi.toString(),
    walks: stats.walks.toString(),
    strikeouts: stats.strikeouts.toString(),
    stolen_bases: stats.stolen_bases.toString(),
  });

  // Calcular métricas automáticamente
  const calculateMetrics = () => {
    const atBats = parseInt(formData.at_bats) || 0;
    const hits = parseInt(formData.hits) || 0;
    const doubles = parseInt(formData.doubles) || 0;
    const triples = parseInt(formData.triples) || 0;
    const homeRuns = parseInt(formData.home_runs) || 0;
    const walks = parseInt(formData.walks) || 0;

    // Batting Average
    const battingAverage = atBats > 0 ? hits / atBats : 0;

    // On-Base Percentage
    const plateAppearances = atBats + walks;
    const onBasePercentage = plateAppearances > 0 ? (hits + walks) / plateAppearances : 0;

    // Slugging Percentage
    const totalBases = hits + doubles + (triples * 2) + (homeRuns * 3);
    const sluggingPercentage = atBats > 0 ? totalBases / atBats : 0;

    return {
      batting_average: parseFloat(battingAverage.toFixed(3)),
      on_base_percentage: parseFloat(onBasePercentage.toFixed(3)),
      slugging_percentage: parseFloat(sluggingPercentage.toFixed(3)),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const metrics = calculateMetrics();

      await updatePlayerStats(player.id, {
        games_played: parseInt(formData.games_played),
        at_bats: parseInt(formData.at_bats),
        hits: parseInt(formData.hits),
        doubles: parseInt(formData.doubles),
        triples: parseInt(formData.triples),
        home_runs: parseInt(formData.home_runs),
        rbi: parseInt(formData.rbi),
        walks: parseInt(formData.walks),
        strikeouts: parseInt(formData.strikeouts),
        stolen_bases: parseInt(formData.stolen_bases),
        ...metrics,
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error actualizando estadísticas:', error);
      alert('Error al actualizar estadísticas');
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
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Editar Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Estadísticas - {player.name}</DialogTitle>
          <DialogDescription>
            Actualiza las estadísticas del jugador. AVG, OBP y SLG se calcularán automáticamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Juegos y Turnos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="games_played">Juegos Jugados (GP)</Label>
              <Input
                id="games_played"
                type="number"
                value={formData.games_played}
                onChange={(e) => setFormData({ ...formData, games_played: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="at_bats">Turnos al Bate (AB)</Label>
              <Input
                id="at_bats"
                type="number"
                value={formData.at_bats}
                onChange={(e) => setFormData({ ...formData, at_bats: e.target.value })}
                min="0"
              />
            </div>
          </div>

          {/* Hits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="hits">Hits (H)</Label>
              <Input
                id="hits"
                type="number"
                value={formData.hits}
                onChange={(e) => setFormData({ ...formData, hits: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="doubles">Dobles (2B)</Label>
              <Input
                id="doubles"
                type="number"
                value={formData.doubles}
                onChange={(e) => setFormData({ ...formData, doubles: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="triples">Triples (3B)</Label>
              <Input
                id="triples"
                type="number"
                value={formData.triples}
                onChange={(e) => setFormData({ ...formData, triples: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="home_runs">Home Runs (HR)</Label>
              <Input
                id="home_runs"
                type="number"
                value={formData.home_runs}
                onChange={(e) => setFormData({ ...formData, home_runs: e.target.value })}
                min="0"
              />
            </div>
          </div>

          {/* Otras estadísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rbi">RBI</Label>
              <Input
                id="rbi"
                type="number"
                value={formData.rbi}
                onChange={(e) => setFormData({ ...formData, rbi: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="walks">Bases por Bolas (BB)</Label>
              <Input
                id="walks"
                type="number"
                value={formData.walks}
                onChange={(e) => setFormData({ ...formData, walks: e.target.value })}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="strikeouts">Ponches (SO)</Label>
              <Input
                id="strikeouts"
                type="number"
                value={formData.strikeouts}
                onChange={(e) => setFormData({ ...formData, strikeouts: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="stolen_bases">Bases Robadas (SB)</Label>
              <Input
                id="stolen_bases"
                type="number"
                value={formData.stolen_bases}
                onChange={(e) => setFormData({ ...formData, stolen_bases: e.target.value })}
                min="0"
              />
            </div>
          </div>

          {/* Preview de métricas calculadas */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Vista previa de métricas:</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">AVG</p>
                <p className="text-lg font-bold">
                  .{(calculateMetrics().batting_average * 1000).toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">OBP</p>
                <p className="text-lg font-bold">
                  .{(calculateMetrics().on_base_percentage * 1000).toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SLG</p>
                <p className="text-lg font-bold">
                  .{(calculateMetrics().slugging_percentage * 1000).toFixed(0)}
                </p>
              </div>
            </div>
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