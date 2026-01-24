// src/components/scorecard/ScorecardGrid.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AtBatButtons } from './AtBatButtons';
import { Trash2 } from 'lucide-react';
import { deleteAtBat } from '@/lib/supabase-queries';

interface ScorecardGridProps {
  gameId: number;
  lineup: any[];
  atBats: any[];
  onUpdate: () => void;
  isAuthenticated: boolean;
}

export function ScorecardGrid({ gameId, lineup, atBats, onUpdate, isAuthenticated }: ScorecardGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ playerId: number; inning: number; battingOrder: number } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const maxInnings = 9;

  // Agrupar at bats por jugador e inning
  const getAtBatForCell = (playerId: number, inning: number) => {
    return atBats.find(ab => ab.player_id === playerId && ab.inning === inning);
  };

  const handleCellClick = (playerId: number, inning: number, battingOrder: number) => {
    if (!isAuthenticated) return;
    setSelectedCell({ playerId, inning, battingOrder });
  };

  const handleDelete = async (atBatId: number) => {
    if (!confirm('¿Eliminar esta anotación?')) return;
    
    setDeleteLoading(atBatId);
    try {
      await deleteAtBat(atBatId);
      onUpdate();
    } catch (error) {
      console.error('Error deleting at bat:', error);
      alert('Error al eliminar');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleAtBatRecorded = () => {
    setSelectedCell(null);
    onUpdate();
  };

  // Calcular totales por jugador
  const getPlayerTotals = (playerId: number) => {
    const playerAtBats = atBats.filter(ab => ab.player_id === playerId);
    const hits = playerAtBats.filter(ab => ['1B', '2B', '3B', 'HR'].includes(ab.result_type)).length;
    const abs = playerAtBats.filter(ab => !['BB', 'HBP'].includes(ab.result_type)).length;
    const runs = playerAtBats.reduce((sum, ab) => sum + (ab.runs_scored || 0), 0);
    const rbis = playerAtBats.reduce((sum, ab) => sum + (ab.rbis || 0), 0);
    
    return { hits, abs, runs, rbis };
  };

  // Calcular runs por inning
  const getInningRuns = (inning: number) => {
    return atBats
      .filter(ab => ab.inning === inning)
      .reduce((sum, ab) => sum + (ab.runs_scored || 0), 0);
  };

  return (
    <div className="space-y-6">
      
      {/* Grid Container - Scroll horizontal en mobile */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Hoja de Anotación</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  <th className="sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 p-3 text-left min-w-[150px] border-r">
                    Jugador
                  </th>
                  <th className="p-3 text-center min-w-[60px] border-r">Pos</th>
                  {Array.from({ length: maxInnings }, (_, i) => (
                    <th key={i + 1} className="p-3 text-center min-w-[80px] border-r">
                      {i + 1}
                    </th>
                  ))}
                  <th className="p-3 text-center min-w-[80px] bg-blue-50 dark:bg-blue-950">
                    Totales
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineup.map((lineupPlayer, idx) => {
                  const totals = getPlayerTotals(lineupPlayer.player_id);
                  
                  return (
                    <tr key={lineupPlayer.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      {/* Jugador */}
                      <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 p-3 border-r">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-sm">#{lineupPlayer.player.number}</p>
                            <p className="text-xs text-muted-foreground">{lineupPlayer.player.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Posición */}
                      <td className="p-3 text-center border-r">
                        <Badge variant="outline">{lineupPlayer.position}</Badge>
                      </td>

                      {/* Innings */}
                      {Array.from({ length: maxInnings }, (_, i) => {
                        const inning = i + 1;
                        const atBat = getAtBatForCell(lineupPlayer.player_id, inning);

                        return (
                          <td 
                            key={inning} 
                            className="p-2 border-r cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30 relative"
                            onClick={() => handleCellClick(lineupPlayer.player_id, inning, lineupPlayer.batting_order)}
                          >
                            {atBat ? (
                              <div className="flex items-center justify-center gap-1 min-h-[60px]">
                                <div className="text-center">
                                  <Badge 
                                    className={`
                                      ${['1B', '2B', '3B', 'HR'].includes(atBat.result_type) ? 'bg-green-500' : ''}
                                      ${atBat.result_type === 'K' ? 'bg-red-500' : ''}
                                      ${atBat.result_type === 'BB' ? 'bg-blue-500' : ''}
                                      ${['F', 'G', 'L', 'P'].some(t => atBat.result_type.startsWith(t)) ? 'bg-slate-500' : ''}
                                    `}
                                  >
                                    {atBat.result_type}
                                  </Badge>
                                  {atBat.stolen_base && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">SB</p>
                                  )}
                                  {atBat.runs_scored > 0 && (
                                    <p className="text-xs font-bold text-green-600 dark:text-green-400 mt-1">
                                      {atBat.runs_scored}R
                                    </p>
                                  )}
                                  {isAuthenticated && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(atBat.id);
                                      }}
                                      disabled={deleteLoading === atBat.id}
                                    >
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="min-h-[60px] flex items-center justify-center text-slate-300 dark:text-slate-700">
                                {isAuthenticated ? '+' : '—'}
                              </div>
                            )}
                          </td>
                        );
                      })}

                      {/* Totales */}
                      <td className="p-3 text-center bg-blue-50 dark:bg-blue-950">
                        <div className="text-xs space-y-1">
                          <p><span className="font-bold">{totals.hits}</span>/{totals.abs}</p>
                          <p className="text-green-600 dark:text-green-400">{totals.runs}R</p>
                          <p className="text-blue-600 dark:text-blue-400">{totals.rbis}RBI</p>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Fila de totales por inning */}
                <tr className="bg-blue-50 dark:bg-blue-950 font-bold">
                  <td colSpan={2} className="p-3 border-r">Runs por Inning</td>
                  {Array.from({ length: maxInnings }, (_, i) => (
                    <td key={i + 1} className="p-3 text-center border-r">
                      {getInningRuns(i + 1) || '—'}
                    </td>
                  ))}
                  <td className="p-3 text-center text-xl">
                    {atBats.reduce((sum, ab) => sum + (ab.runs_scored || 0), 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de botones para registrar at bat */}
      {selectedCell && isAuthenticated && (
        <AtBatButtons
          gameId={gameId}
          playerId={selectedCell.playerId}
          inning={selectedCell.inning}
          battingOrder={selectedCell.battingOrder}
          onClose={() => setSelectedCell(null)}
          onRecorded={handleAtBatRecorded}
        />
      )}
    </div>
  );
}