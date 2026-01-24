// src/components/scorecard/LineupSelector.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createGameLineup } from '@/lib/supabase-queries';
import { X } from 'lucide-react';

interface LineupSelectorProps {
  gameId: number;
  players: any[];
  existingLineup: any[];
  onLineupCreated: () => void;
}

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

export function LineupSelector({ gameId, players, existingLineup, onLineupCreated }: LineupSelectorProps) {
  const [lineup, setLineup] = useState<Array<{ player_id: number; position: string }>>(
    existingLineup.length > 0 
      ? existingLineup.map(l => ({ player_id: l.player_id, position: l.position }))
      : Array(9).fill({ player_id: 0, position: '' })
  );
  const [loading, setLoading] = useState(false);

  const handlePlayerChange = (index: number, playerId: string) => {
    const newLineup = [...lineup];
    newLineup[index] = { ...newLineup[index], player_id: parseInt(playerId) };
    setLineup(newLineup);
  };

  const handlePositionChange = (index: number, position: string) => {
    const newLineup = [...lineup];
    newLineup[index] = { ...newLineup[index], position };
    setLineup(newLineup);
  };

  // Obtener jugadores ya seleccionados
  const getSelectedPlayerIds = () => {
    return lineup
      .filter(l => l.player_id > 0)
      .map(l => l.player_id);
  };

  // Obtener posiciones ya seleccionadas
  const getSelectedPositions = () => {
    return lineup
      .filter(l => l.position !== '')
      .map(l => l.position);
  };

  // Filtrar jugadores disponibles para cada slot
  const getAvailablePlayers = (currentIndex: number) => {
    const selectedIds = getSelectedPlayerIds();
    const currentPlayerId = lineup[currentIndex].player_id;
    
    return players.filter(player => 
      !selectedIds.includes(player.id) || player.id === currentPlayerId
    );
  };

  // Filtrar posiciones disponibles para cada slot
  const getAvailablePositions = (currentIndex: number) => {
    const selectedPositions = getSelectedPositions();
    const currentPosition = lineup[currentIndex].position;
    
    return POSITIONS.filter(pos => 
      !selectedPositions.includes(pos) || pos === currentPosition
    );
  };

  const handleSubmit = async () => {
    // Validar que todos tengan jugador y posición
    const validLineup = lineup.filter(l => l.player_id > 0 && l.position);
    
    if (validLineup.length === 0) {
      alert('Debes agregar al menos un jugador al lineup');
      return;
    }

    // Validar que no haya duplicados
    const playerIds = validLineup.map(l => l.player_id);
    const positions = validLineup.map(l => l.position);
    
    if (new Set(playerIds).size !== playerIds.length) {
      alert('No puedes tener al mismo jugador dos veces en el lineup');
      return;
    }

    if (new Set(positions).size !== positions.length) {
      alert('No puedes tener la misma posición dos veces');
      return;
    }

    setLoading(true);
    try {
      const lineupData = validLineup.map((l, index) => ({
        game_id: gameId,
        player_id: l.player_id,
        batting_order: index + 1,
        position: l.position,
      }));

      await createGameLineup(lineupData);
      onLineupCreated();
    } catch (error) {
      console.error('Error creating lineup:', error);
      alert('Error al crear el lineup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Configurar Lineup</CardTitle>
        <CardDescription>
          Selecciona los jugadores y sus posiciones defensivas (sin duplicados)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lineup.map((item, index) => {
          const availablePlayers = getAvailablePlayers(index);
          const availablePositions = getAvailablePositions(index);

          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>

              {/* Selector de Jugador */}
              <Select 
                value={item.player_id > 0 ? item.player_id.toString() : ''} 
                onValueChange={(value) => handlePlayerChange(index, value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona jugador" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      #{player.number} - {player.name}
                    </SelectItem>
                  ))}
                  {availablePlayers.length === 0 && (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      Todos los jugadores ya fueron seleccionados
                    </div>
                  )}
                </SelectContent>
              </Select>

              {/* Selector de Posición */}
              <Select 
                value={item.position} 
                onValueChange={(value) => handlePositionChange(index, value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Posición" />
                </SelectTrigger>
                <SelectContent>
                  {availablePositions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                  {availablePositions.length === 0 && (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      Todas las posiciones ya fueron usadas
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          );
        })}

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            {loading ? 'Guardando...' : 'Guardar Lineup'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}