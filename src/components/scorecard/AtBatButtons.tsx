// src/components/scorecard/AtBatButtons.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { addAtBat } from '@/lib/supabase-queries';
import { X } from 'lucide-react';

interface AtBatButtonsProps {
  gameId: number;
  playerId: number;
  inning: number;
  battingOrder: number;
  onClose: () => void;
  onRecorded: () => void;
}

export function AtBatButtons({ gameId, playerId, inning, battingOrder, onClose, onRecorded }: AtBatButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState('');
  const [runsScored, setRunsScored] = useState(0);
  const [rbis, setRbis] = useState(0);
  const [stolenBase, setStolenBase] = useState(false);

  const resultTypes = [
    // Hits
    { value: '1B', label: '1B', description: 'Sencillo', color: 'bg-green-500 hover:bg-green-600' },
    { value: '2B', label: '2B', description: 'Doble', color: 'bg-green-600 hover:bg-green-700' },
    { value: '3B', label: '3B', description: 'Triple', color: 'bg-green-700 hover:bg-green-800' },
    { value: 'HR', label: 'HR', description: 'Home Run', color: 'bg-green-800 hover:bg-green-900' },
    
    // Outs
    { value: 'K', label: 'K', description: 'Strikeout', color: 'bg-red-500 hover:bg-red-600' },
    { value: 'F7', label: 'F7', description: 'Fly LF', color: 'bg-slate-500 hover:bg-slate-600' },
    { value: 'F8', label: 'F8', description: 'Fly CF', color: 'bg-slate-500 hover:bg-slate-600' },
    { value: 'F9', label: 'F9', description: 'Fly RF', color: 'bg-slate-500 hover:bg-slate-600' },
    { value: 'G6-3', label: '6-3', description: 'Ground SS-1B', color: 'bg-slate-600 hover:bg-slate-700' },
    { value: 'G4-3', label: '4-3', description: 'Ground 2B-1B', color: 'bg-slate-600 hover:bg-slate-700' },
    { value: 'G5-3', label: '5-3', description: 'Ground 3B-1B', color: 'bg-slate-600 hover:bg-slate-700' },
    { value: 'G1-3', label: '1-3', description: 'Ground P-1B', color: 'bg-slate-600 hover:bg-slate-700' },
    
    // Bases por bolas
    { value: 'BB', label: 'BB', description: 'Base por Bolas', color: 'bg-blue-500 hover:bg-blue-600' },
    { value: 'HBP', label: 'HBP', description: 'Hit by Pitch', color: 'bg-blue-600 hover:bg-blue-700' },
    
    // Otros
    { value: 'E', label: 'E', description: 'Error', color: 'bg-orange-500 hover:bg-orange-600' },
    { value: 'FC', label: 'FC', description: 'Fielder Choice', color: 'bg-yellow-500 hover:bg-yellow-600' },
  ];

  const handleRecord = async (resultType: string) => {
    setLoading(true);
    try {
      await addAtBat({
        game_id: gameId,
        player_id: playerId,
        inning,
        batting_order: battingOrder,
        result_type: resultType,
        runs_scored: runsScored,
        rbis: rbis,
        stolen_base: stolenBase,
      });

      onRecorded();
    } catch (error) {
      console.error('Error recording at bat:', error);
      alert('Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registrar Turno al Bat - Inning {inning}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Resultado del turno */}
          <div>
            <Label className="text-lg font-bold mb-4 block">Resultado</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {resultTypes.map((type) => (
                <Button
                  key={type.value}
                  onClick={() => handleRecord(type.value)}
                  disabled={loading}
                  className={`${type.color} text-white h-auto py-4 flex flex-col items-center gap-1`}
                >
                  <span className="text-2xl font-black">{type.label}</span>
                  <span className="text-xs opacity-90">{type.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            
            {/* Runs anotadas */}
            <div>
              <Label htmlFor="runs">Carreras Anotadas</Label>
              <Input
                id="runs"
                type="number"
                min="0"
                value={runsScored}
                onChange={(e) => setRunsScored(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            {/* RBIs */}
            <div>
              <Label htmlFor="rbis">RBIs</Label>
              <Input
                id="rbis"
                type="number"
                min="0"
                value={rbis}
                onChange={(e) => setRbis(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            {/* Base robada */}
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="stolen"
                checked={stolenBase}
                onCheckedChange={(checked) => setStolenBase(checked as boolean)}
              />
              <Label htmlFor="stolen" className="cursor-pointer">
                Base Robada (SB)
              </Label>
            </div>
          </div>

          {/* Botón cancelar */}
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}