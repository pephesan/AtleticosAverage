// src/app/stats/page.tsx
import { getPlayers, getPlayerStats, getTeamStats } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { TrendingUp, Trophy, Target, Zap, Award, Crown, Plus } from 'lucide-react';
import { TeamStatsChart } from '@/components/TeamStatsChart';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const players = await getPlayers();
  const playerStats = await getPlayerStats();
  const teamStats = await getTeamStats();

  if (!teamStats) {
    return <div>Error cargando datos</div>;
  }

  // Rankings
  const topBatters = playerStats
    .sort((a, b) => b.batting_average - a.batting_average)
    .slice(0, 10)
    .map((stat, index) => ({
      ...stat,
      player: players.find(p => p.id === stat.player_id),
      rank: index + 1
    }));

  const topHomeRuns = playerStats
    .sort((a, b) => b.home_runs - a.home_runs)
    .slice(0, 10)
    .map((stat, index) => ({
      ...stat,
      player: players.find(p => p.id === stat.player_id),
      rank: index + 1
    }));

  const topRBI = playerStats
    .sort((a, b) => b.rbi - a.rbi)
    .slice(0, 10)
    .map((stat, index) => ({
      ...stat,
      player: players.find(p => p.id === stat.player_id),
      rank: index + 1
    }));

  const topStolenBases = playerStats
    .sort((a, b) => b.stolen_bases - a.stolen_bases)
    .slice(0, 10)
    .map((stat, index) => ({
      ...stat,
      player: players.find(p => p.id === stat.player_id),
      rank: index + 1
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white">
                Estadísticas
              </h1>
              <p className="text-muted-foreground">Análisis completo de rendimiento</p>
            </div>
          </div>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-5xl font-black mb-1">
                .{(teamStats.team_batting_average * 1000).toFixed(0)}
              </p>
              <p className="text-blue-100 font-medium">Promedio del Equipo</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-5xl font-black mb-1">{teamStats.total_runs}</p>
              <p className="text-green-100 font-medium">Carreras Totales</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-5xl font-black mb-1">{teamStats.total_hits}</p>
              <p className="text-orange-100 font-medium">Hits Totales</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-5xl font-black mb-1">{players.length}</p>
              <p className="text-purple-100 font-medium">Jugadores Activos</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <TeamStatsChart playerStats={playerStats} players={players} />

        {/* Rankings Tabs */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Rankings de Líderes</CardTitle>
                <CardDescription>Top 10 jugadores por categoría</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="avg" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-12 bg-slate-100 dark:bg-slate-800">
                <TabsTrigger value="avg" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Promedio
                </TabsTrigger>
                <TabsTrigger value="hr" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Home Runs
                </TabsTrigger>
                <TabsTrigger value="rbi" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  RBI
                </TabsTrigger>
                <TabsTrigger value="sb" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  Bases Robadas
                </TabsTrigger>
              </TabsList>

              {/* Promedio */}
              <TabsContent value="avg" className="mt-6">
                <div className="space-y-3">
                  {topBatters.map((stat) => (
                    <Link 
                      key={stat.player_id} 
                      href={`/players/${stat.player_id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors border-2 border-transparent hover:border-blue-500">
                        
                        {/* Rank */}
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0
                          ${stat.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : ''}
                          ${stat.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' : ''}
                          ${stat.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white' : ''}
                          ${stat.rank > 3 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : ''}
                        `}>
                          {stat.rank}
                        </div>

                        {/* Player */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                            {stat.player?.number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base truncate group-hover:text-blue-600 transition-colors">
                              {stat.player?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.player?.position}</p>
                          </div>
                        </div>

                        {/* Stat */}
                        <div className="text-right shrink-0">
                          <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                            .{(stat.batting_average * 1000).toFixed(0)}
                          </p>
                          <p className="text-xs text-muted-foreground">{stat.at_bats} AB</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              {/* Home Runs */}
              <TabsContent value="hr" className="mt-6">
                <div className="space-y-3">
                  {topHomeRuns.map((stat) => (
                    <Link 
                      key={stat.player_id} 
                      href={`/players/${stat.player_id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors border-2 border-transparent hover:border-orange-500">
                        
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0
                          ${stat.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : ''}
                          ${stat.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' : ''}
                          ${stat.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white' : ''}
                          ${stat.rank > 3 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : ''}
                        `}>
                          {stat.rank}
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                            {stat.player?.number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base truncate group-hover:text-orange-600 transition-colors">
                              {stat.player?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.player?.position}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                            {stat.home_runs}
                          </p>
                          <p className="text-xs text-muted-foreground">HR</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              {/* RBI */}
              <TabsContent value="rbi" className="mt-6">
                <div className="space-y-3">
                  {topRBI.map((stat) => (
                    <Link 
                      key={stat.player_id} 
                      href={`/players/${stat.player_id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors border-2 border-transparent hover:border-green-500">
                        
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0
                          ${stat.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : ''}
                          ${stat.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' : ''}
                          ${stat.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white' : ''}
                          ${stat.rank > 3 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : ''}
                        `}>
                          {stat.rank}
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                            {stat.player?.number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base truncate group-hover:text-green-600 transition-colors">
                              {stat.player?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.player?.position}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-3xl font-black text-green-600 dark:text-green-400">
                            {stat.rbi}
                          </p>
                          <p className="text-xs text-muted-foreground">RBI</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              {/* Stolen Bases */}
              <TabsContent value="sb" className="mt-6">
                <div className="space-y-3">
                  {topStolenBases.map((stat) => (
                    <Link 
                      key={stat.player_id} 
                      href={`/players/${stat.player_id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors border-2 border-transparent hover:border-purple-500">
                        
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0
                          ${stat.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : ''}
                          ${stat.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' : ''}
                          ${stat.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white' : ''}
                          ${stat.rank > 3 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : ''}
                        `}>
                          {stat.rank}
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                            {stat.player?.number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base truncate group-hover:text-purple-600 transition-colors">
                              {stat.player?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.player?.position}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                            {stat.stolen_bases}
                          </p>
                          <p className="text-xs text-muted-foreground">SB</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}