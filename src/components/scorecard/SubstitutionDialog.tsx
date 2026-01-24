// src/components/scorecard/SubstitutionDialog.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { addSubstitution } from '@/lib/supabase-queries';
import { X, RefreshCw } from 'lucide-react';

interface SubstitutionDialogProps {
  gameId: number;
  playerOut: any;
  battingOrder: number;
  currentPosition: string;
  availablePlayers: any[];
  onClose: () => void;
  onSubstituted: () => void;
}

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

export function SubstitutionDialog({
  gameId,
  playerOut,
  battingOrder,
  currentPosition,
  availablePlayers,
  onClose,
  onSubstituted,
}: SubstitutionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [inning, setInning] = useState('');
  const [playerInId, setPlayerInId] = useState('');
  const [position, setPosition] = useState(currentPosition);

  const handleSubmit = async () => {
    if (!inning || !playerInId) {
      alert('Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await addSubstitution({
        game_id: gameId,
        inning: parseInt(inning),
        player_out_id: playerOut.id,
        player_in_id: parseInt(playerInId),
        batting_order: battingOrder,
        position: position,
      });

      onSubstituted();
    } catch (error) {
      console.error('Error adding substitution:', error);
      alert('Error al registrar la sustitución');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              <CardTitle>Registrar Cambio</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Jugador que sale: #{playerOut.number} - {playerOut.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Inning del cambio */}
          <div className="space-y-2">
            <Label htmlFor="inning">¿En qué inning entra el sustituto? *</Label>
            <Select value={inning} onValueChange={setInning}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona inning" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((inn) => (
                  <SelectItem key={inn} value={inn.toString()}>
                    Inning {inn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jugador que entra */}
          <div className="space-y-2">
            <Label htmlFor="player_in">Jugador que entra *</Label>
            <Select value={playerInId} onValueChange={setPlayerInId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona jugador" />
              </SelectTrigger>
              <SelectContent>
                {availablePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id.toString()}>
                    #{player.number} - {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Posición */}
          <div className="space-y-2">
            <Label htmlFor="position">Posición Defensiva *</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              {loading ? 'Registrando...' : 'Registrar Cambio'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}