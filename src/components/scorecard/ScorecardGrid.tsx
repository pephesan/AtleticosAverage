// src/components/scorecard/ScorecardGrid.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AtBatButtons } from './AtBatButtons';
import { SubstitutionDialog } from './SubstitutionDialog';
import { Trash2, RefreshCw } from 'lucide-react';
import { deleteAtBat, deleteSubstitution } from '@/lib/supabase-queries';

interface ScorecardGridProps {
  gameId: number;
  lineup: any[];
  atBats: any[];
  substitutions: any[];
  allPlayers: any[];
  onUpdate: () => void;
  isAuthenticated: boolean;
}

export function ScorecardGrid({ 
  gameId, 
  lineup, 
  atBats, 
  substitutions, 
  allPlayers, 
  onUpdate, 
  isAuthenticated 
}: ScorecardGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ playerId: number; inning: number; battingOrder: number } | null>(null);
  const [substitutionDialog, setSubstitutionDialog] = useState<{ playerOut: any; battingOrder: number; position: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const maxInnings = 9;

  // Construir la estructura expandida del lineup con sustituciones
  const getExpandedLineup = () => {
    return lineup.map(lineupPlayer => {
      const subs = substitutions.filter(s => s.batting_order === lineupPlayer.batting_order);
      
      return {
        original: lineupPlayer,
        substitutes: subs.sort((a, b) => a.inning - b.inning),
      };
    });
  };

  // Obtener el jugador activo en un inning específico
  const getActivePlayer = (battingOrder: number, inning: number) => {
    const subs = substitutions
      .filter(s => s.batting_order === battingOrder && s.inning <= inning)
      .sort((a, b) => b.inning - a.inning);
    
    if (subs.length > 0) {
      return subs[0].player_in_id;
    }
    
    const originalPlayer = lineup.find(l => l.batting_order === battingOrder);
    return originalPlayer?.player_id;
  };

  // Agrupar at bats por jugador e inning
  const getAtBatForCell = (playerId: number, inning: number) => {
    return atBats.find(ab => ab.player_id === playerId && ab.inning === inning);
  };

  const handleCellClick = (playerId: number, inning: number, battingOrder: number) => {
    if (!isAuthenticated) return;
    setSelectedCell({ playerId, inning, battingOrder });
  };

  const handleDeleteAtBat = async (atBatId: number) => {
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

  const handleDeleteSubstitution = async (subId: number) => {
    if (!confirm('¿Eliminar esta sustitución?')) return;
    
    try {
      await deleteSubstitution(subId);
      onUpdate();
    } catch (error) {
      console.error('Error deleting substitution:', error);
      alert('Error al eliminar la sustitución');
    }
  };

  const handleAtBatRecorded = () => {
    setSelectedCell(null);
    onUpdate();
  };

  const handleSubstitutionRecorded = () => {
    setSubstitutionDialog(null);
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

  // Obtener jugadores disponibles para sustitución (los que no están en el lineup actual)
  const getAvailablePlayersForSubstitution = (battingOrder: number) => {
    const lineupPlayerIds = lineup.map(l => l.player_id);
    const subsPlayerIds = substitutions
      .filter(s => s.batting_order !== battingOrder)
      .map(s => s.player_in_id);
    
    const usedPlayerIds = [...lineupPlayerIds, ...subsPlayerIds];
    
    return allPlayers.filter(p => !usedPlayerIds.includes(p.id));
  };

  const expandedLineup = getExpandedLineup();

  return (
    <div className="space-y-6">
      
      {/* Grid Container */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Hoja de Anotación</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  <th className="sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 p-3 text-left min-w-[180px] border-r">
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
                {expandedLineup.map((item, idx) => {
                  const originalPlayer = item.original.player;
                  const originalTotals = getPlayerTotals(item.original.player_id);
                  
                  return (
                    <>
                      {/* Fila del jugador original */}
                      <tr key={`original-${item.original.id}`} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        {/* Jugador */}
                        <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 p-3 border-r">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">#{originalPlayer.number} {originalPlayer.name}</p>
                            </div>
                            {isAuthenticated && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-blue-500 hover:text-blue-600 shrink-0"
                                onClick={() => setSubstitutionDialog({
                                  playerOut: item.original.player,
                                  battingOrder: item.original.batting_order,
                                  position: item.original.position,
                                })}
                                title="Hacer cambio"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>

                        {/* Posición */}
                        <td className="p-3 text-center border-r">
                          <Badge variant="outline">{item.original.position}</Badge>
                        </td>

                        {/* Innings */}
                        {Array.from({ length: maxInnings }, (_, i) => {
                          const inning = i + 1;
                          const activePlayerId = getActivePlayer(item.original.batting_order, inning);
                          const isActivePlayer = activePlayerId === item.original.player_id;
                          const atBat = getAtBatForCell(item.original.player_id, inning);

                          return (
                            <td 
                              key={inning} 
                              className={`p-2 border-r cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30 relative ${!isActivePlayer ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                              onClick={() => isActivePlayer && handleCellClick(item.original.player_id, inning, item.original.batting_order)}
                            >
                              {isActivePlayer && atBat ? (
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
                                          handleDeleteAtBat(atBat.id);
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
                                  {isActivePlayer && isAuthenticated ? '+' : '—'}
                                </div>
                              )}
                            </td>
                          );
                        })}

                        {/* Totales */}
                        <td className="p-3 text-center bg-blue-50 dark:bg-blue-950">
                          <div className="text-xs space-y-1">
                            <p><span className="font-bold">{originalTotals.hits}</span>/{originalTotals.abs}</p>
                            <p className="text-green-600 dark:text-green-400">{originalTotals.runs}R</p>
                            <p className="text-blue-600 dark:text-blue-400">{originalTotals.rbis}RBI</p>
                          </div>
                        </td>
                      </tr>

                      {/* Filas de sustitutos */}
                      {item.substitutes.map((sub) => {
                        const subPlayer = sub.player_in;
                        const subTotals = getPlayerTotals(sub.player_in_id);
                        
                        return (
                          <tr key={`sub-${sub.id}`} className="border-b border-dashed hover:bg-orange-50 dark:hover:bg-orange-950/20 bg-orange-50/30 dark:bg-orange-950/10">
                            {/* Jugador sustituto */}
                            <td className="sticky left-0 z-10 bg-orange-50/50 dark:bg-orange-950/20 p-3 border-r">
                              <div className="flex items-center gap-2">
                                <RefreshCw className="w-6 h-6 text-orange-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-orange-600 dark:text-orange-400 truncate">
                                    #{subPlayer.number} {subPlayer.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Entra en inning {sub.inning}</p>
                                </div>
                                {isAuthenticated && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-500 hover:text-red-600 shrink-0"
                                    onClick={() => handleDeleteSubstitution(sub.id)}
                                    title="Eliminar cambio"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>

                            {/* Posición */}
                            <td className="p-3 text-center border-r bg-orange-50/50 dark:bg-orange-950/20">
                              <Badge variant="outline" className="border-orange-500 text-orange-600 dark:text-orange-400">
                                {sub.position}
                              </Badge>
                            </td>

                            {/* Innings */}
                            {Array.from({ length: maxInnings }, (_, i) => {
                              const inning = i + 1;
                              const isActiveInning = inning >= sub.inning;
                              const activePlayerId = getActivePlayer(sub.batting_order, inning);
                              const isActivePlayer = activePlayerId === sub.player_in_id;
                              const atBat = getAtBatForCell(sub.player_in_id, inning);

                              return (
                                <td 
                                  key={inning} 
                                  className={`p-2 border-r cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950/40 relative ${!isActiveInning || !isActivePlayer ? 'bg-slate-100 dark:bg-slate-800' : 'bg-orange-50/50 dark:bg-orange-950/20'}`}
                                  onClick={() => isActiveInning && isActivePlayer && handleCellClick(sub.player_in_id, inning, sub.batting_order)}
                                >
                                  {isActiveInning && isActivePlayer && atBat ? (
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
                                              handleDeleteAtBat(atBat.id);
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
                                      {isActiveInning && isActivePlayer && isAuthenticated ? '+' : '—'}
                                    </div>
                                  )}
                                </td>
                              );
                            })}

                            {/* Totales */}
                            <td className="p-3 text-center bg-orange-50 dark:bg-orange-950/30">
                              <div className="text-xs space-y-1">
                                <p><span className="font-bold">{subTotals.hits}</span>/{subTotals.abs}</p>
                                <p className="text-green-600 dark:text-green-400">{subTotals.runs}R</p>
                                <p className="text-blue-600 dark:text-blue-400">{subTotals.rbis}RBI</p>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
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

      {/* Diálogo de sustitución */}
      {substitutionDialog && isAuthenticated && (
        <SubstitutionDialog
          gameId={gameId}
          playerOut={substitutionDialog.playerOut}
          battingOrder={substitutionDialog.battingOrder}
          currentPosition={substitutionDialog.position}
          availablePlayers={getAvailablePlayersForSubstitution(substitutionDialog.battingOrder)}
          onClose={() => setSubstitutionDialog(null)}
          onSubstituted={handleSubstitutionRecorded}
        />
      )}
    </div>
  );
}