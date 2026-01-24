// src/components/scorecard/ScorecardView.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Plus } from 'lucide-react';
import Link from 'next/link';
import { getGameById, getGameLineup, getAtBats, getPlayers, getSubstitutions } from '@/lib/supabase-queries';
import { LineupSelector } from './LineupSelector';
import { ScorecardGrid } from './ScorecardGrid';
import { useAuth } from '@/hooks/useAuth';

interface ScorecardViewProps {
  gameId: string;
}

export function ScorecardView({ gameId }: ScorecardViewProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [game, setGame] = useState<any>(null);
  const [lineup, setLineup] = useState<any[]>([]);
  const [atBats, setAtBats] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [substitutions, setSubstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLineupSelector, setShowLineupSelector] = useState(false);

  useEffect(() => {
    loadData();
  }, [gameId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gameData, lineupData, atBatsData, playersData, substitutionsData] = await Promise.all([
        getGameById(parseInt(gameId)),
        getGameLineup(parseInt(gameId)),
        getAtBats(parseInt(gameId)),
        getPlayers(),
        getSubstitutions(parseInt(gameId)),
      ]);

      setGame(gameData);
      setLineup(lineupData);
      setAtBats(atBatsData);
      setPlayers(playersData);
      setSubstitutions(substitutionsData);
    } catch (error) {
      console.error('Error loading scorecard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLineupCreated = () => {
    setShowLineupSelector(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando scorecard...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto p-6">
        <p>Juego no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/games`}>
              <Button variant="ghost" className="mb-2 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver a Juegos
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  Scorecard
                </h1>
                <p className="text-muted-foreground">
                  vs {game.opponent} • {new Date(game.date).toLocaleDateString('es-MX')}
                </p>
              </div>
            </div>
          </div>

          {/* Botón para crear/editar lineup */}
          {isAuthenticated && (
            <Button 
              onClick={() => setShowLineupSelector(!showLineupSelector)}
              variant="outline"
              className="gap-2"
            >
              {lineup.length === 0 ? (
                <>
                  <Plus className="w-4 h-4" />
                  Crear Lineup
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Editar Lineup
                </>
              )}
            </Button>
          )}
        </div>

        {/* Selector de Lineup o Grid */}
        {showLineupSelector || lineup.length === 0 ? (
          <LineupSelector 
            gameId={parseInt(gameId)}
            players={players}
            existingLineup={lineup}
            onLineupCreated={handleLineupCreated}
          />
        ) : (
          <ScorecardGrid 
            gameId={parseInt(gameId)}
            lineup={lineup}
            atBats={atBats}
            substitutions={substitutions}
            allPlayers={players}
            onUpdate={loadData}
            isAuthenticated={isAuthenticated}
          />
        )}

      </div>
    </div>
  );
}