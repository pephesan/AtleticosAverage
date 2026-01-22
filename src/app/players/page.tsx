// src/app/players/page.tsx
import { getPlayers, getPlayerStats } from '@/lib/supabase-queries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Search, TrendingUp, Trophy, Target } from 'lucide-react';
import { PlayersSearch } from '@/components/PlayersSearch';

export const dynamic = 'force-dynamic';

export default async function PlayersPage() {
  const players = await getPlayers();
  const playerStats = await getPlayerStats();

  // Calcular stats del equipo
  const totalPlayers = players.length;
  const avgBattingAvg = playerStats.length > 0 
    ? playerStats.reduce((sum, s) => sum + s.batting_average, 0) / playerStats.length 
    : 0;
  const totalHomeRuns = playerStats.reduce((sum, s) => sum + s.home_runs, 0);
  const topBatter = playerStats.sort((a, b) => b.batting_average - a.batting_average)[0];
  const topBatterPlayer = players.find(p => p.id === topBatter?.player_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white">
                Jugadores
              </h1>
              <p className="text-muted-foreground">Roster completo del equipo</p>
            </div>
          </div>
          <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Link href="/players/new">
              + Agregar Jugador
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500 text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    {totalPlayers}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Jugadores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500 text-white">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-3xl font-black text-green-600 dark:text-green-400">
                    .{(avgBattingAvg * 1000).toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Promedio Equipo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500/10 to-red-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500 text-white">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                    {totalHomeRuns}
                  </p>
                  <p className="text-sm text-muted-foreground">Home Runs Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500 text-white">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-yellow-600 dark:text-yellow-400 truncate">
                    {topBatterPlayer?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">Mejor Bateador</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <PlayersSearch />

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map((player) => {
            const stats = playerStats.find((s) => s.player_id === player.id);
            const isTopBatter = topBatter?.player_id === player.id;
            
            return (
              <Link 
                key={player.id}
                href={`/players/${player.id}`}
                className="group"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                  
                  <Card className="relative border-2 hover:border-blue-500 transition-all hover:shadow-2xl h-full overflow-hidden">
                    {/* Top Badge */}
                    {isTopBatter && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-yellow-500 text-white border-0 shadow-lg">
                          👑 Top
                        </Badge>
                      </div>
                    )}

                    <CardContent className="pt-6">
                      {/* Player Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl text-white bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform shadow-xl">
                          {player.number}
                        </div>
                        <div className="flex-1 min-w-0 pt-2">
                          <h3 className="font-black text-xl mb-1 group-hover:text-blue-600 transition-colors truncate">
                            {player.name}
                          </h3>
                          <Badge variant="secondary" className="font-semibold">
                            {player.position}
                          </Badge>
                        </div>
                      </div>

                      {/* Stats */}
                      {stats ? (
                        <div className="space-y-3 pt-4 border-t">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                .{(stats.batting_average * 1000).toFixed(0)}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">AVG</p>
                            </div>
                            <div>
                              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                {stats.home_runs}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">HR</p>
                            </div>
                            <div>
                              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                {stats.rbi}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">RBI</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {stats.hits}
                              </p>
                              <p className="text-xs text-muted-foreground">H</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {stats.walks}
                              </p>
                              <p className="text-xs text-muted-foreground">BB</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {stats.stolen_bases}
                              </p>
                              <p className="text-xs text-muted-foreground">SB</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 border-t">
                          <p className="text-sm text-muted-foreground">Sin estadísticas disponibles</p>
                        </div>
                      )}

                      {/* View Details Button */}
                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          variant="ghost" 
                          className="w-full group-hover:bg-blue-500 group-hover:text-white transition-colors"
                        >
                          Ver Detalles →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {players.length === 0 && (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardContent className="py-16 text-center">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No hay jugadores</h3>
              <p className="text-muted-foreground mb-6">
                Comienza agregando jugadores al roster
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                <Link href="/players/new">
                  + Agregar Primer Jugador
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}