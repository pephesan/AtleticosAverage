// src/app/page.tsx
import { getPlayers, getPlayerStats, getTeamStats, getGames } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy, TrendingUp, Users, Target, Zap, Star, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const players = await getPlayers();
  const playerStats = await getPlayerStats();
  const teamStats = await getTeamStats();
  const games = await getGames();

  if (!teamStats) {
    return (
      <div className="container mx-auto p-6">
        <p>Error cargando datos del equipo</p>
      </div>
    );
  }

  // Calcular racha actual
  const recentGames = games.slice(0, 5);
  const currentStreak = recentGames.reduce((streak, game, index) => {
    if (index === 0) return game.result === 'W' ? 1 : 0;
    if (game.result === recentGames[0].result && game.result === 'W') return streak + 1;
    return streak;
  }, 0);

  // Top 3 bateadores
  const topBatters = playerStats
    .sort((a, b) => b.batting_average - a.batting_average)
    .slice(0, 3)
    .map((stat) => {
      const player = players.find((p) => p.id === stat.player_id);
      return { ...stat, player };
    });

  // Win percentage
  const winPercentage = teamStats.wins / (teamStats.wins + teamStats.losses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="mb-4">
          <p className="text-muted-foreground">Temporada 2026</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Récord Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <Trophy className="w-10 h-10 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {(winPercentage * 100).toFixed(0)}%
                </Badge>
              </div>
              <CardTitle className="text-5xl font-black mt-4">
                {teamStats.wins}-{teamStats.losses}
              </CardTitle>
              <CardDescription className="text-green-100 text-base font-medium">
                Récord General
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Promedio Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <Target className="w-10 h-10 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Top 5
                </Badge>
              </div>
              <CardTitle className="text-5xl font-black mt-4">
                .{(teamStats.team_batting_average * 1000).toFixed(0)}
              </CardTitle>
              <CardDescription className="text-blue-100 text-base font-medium">
                Promedio del Equipo
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Racha Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <Zap className="w-10 h-10 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Actual
                </Badge>
              </div>
              <CardTitle className="text-5xl font-black mt-4">
                {currentStreak}W
              </CardTitle>
              <CardDescription className="text-orange-100 text-base font-medium">
                Racha de Victorias
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Jugadores Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <Users className="w-10 h-10 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Activos
                </Badge>
              </div>
              <CardTitle className="text-5xl font-black mt-4">
                {players.length}
              </CardTitle>
              <CardDescription className="text-purple-100 text-base font-medium">
                Jugadores en Roster
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Top Performers */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Top Bateadores</CardTitle>
                  <CardDescription>Los mejores 3 de la temporada</CardDescription>
                </div>
              </div>
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/players">
                  Ver Todos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topBatters.map((batter, index) => (
  <div
    key={batter.player_id}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
    <Card className="relative border-2 hover:border-blue-500 transition-all hover:shadow-2xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* TODOS CON EL MISMO COLOR */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white bg-gradient-to-br from-blue-500 to-cyan-500">
              {batter.player?.number}
            </div>
            <div>
              <h3 className="font-bold text-lg">{batter.player?.name}</h3>
              <p className="text-sm text-muted-foreground">{batter.player?.position}</p>
            </div>
          </div>
          {index === 0 && (
            <Badge className="bg-yellow-500 text-white border-0">
              👑 Líder
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
  <div className="grid grid-cols-3 gap-4 text-center">
    <div>
      <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
        .{(batter.batting_average * 1000).toFixed(0)}
      </p>
      <p className="text-xs text-muted-foreground">AVG</p>
    </div>
    <div>
      <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
        {batter.home_runs}
      </p>
      <p className="text-xs text-muted-foreground">HR</p>
    </div>
    <div>
      <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
        {batter.rbi}
      </p>
      <p className="text-xs text-muted-foreground">RBI</p>
    </div>
  </div>
</CardContent>
    </Card>
  </div>
))}
            </div>
          </CardContent>
        </Card>

        {/* Roster Completo */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Roster Completo</CardTitle>
                  <CardDescription>Todos los jugadores del equipo</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {players.length} Jugadores
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {players.map((player) => {
                const stats = playerStats.find((s) => s.player_id === player.id);
                return (
                  <Link 
                    key={player.id}
                    href={`/players/${player.id}`}
                    className="group"
                  >
                    <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-xl cursor-pointer h-full">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl text-white bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform">
                            {player.number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base truncate group-hover:text-blue-600 transition-colors">
                              {player.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{player.position}</p>
                          </div>
                        </div>
                        
                        {stats ? (
                          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t">
                            <div>
                              <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                                .{(stats.batting_average * 1000).toFixed(0)}
                              </p>
                              <p className="text-xs text-muted-foreground">AVG</p>
                            </div>
                            <div>
                              <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                                {stats.home_runs}
                              </p>
                              <p className="text-xs text-muted-foreground">HR</p>
                            </div>
                            <div>
                              <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                                {stats.rbi}
                              </p>
                              <p className="text-xs text-muted-foreground">RBI</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center pt-3 border-t">
                            <p className="text-sm text-muted-foreground">Sin estadísticas</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/players">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-blue-500 text-white group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Jugadores</h3>
                    <p className="text-sm text-muted-foreground">Ver roster completo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/games">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer group bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-green-500 text-white group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Juegos</h3>
                    <p className="text-sm text-muted-foreground">Calendario y resultados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/stats">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer group bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-purple-500 text-white group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Estadísticas</h3>
                    <p className="text-sm text-muted-foreground">Análisis detallado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/finanzas">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer group bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-orange-500 text-white group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Finanzas</h3>
                    <p className="text-sm text-muted-foreground">Control de pagos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

      </div>
    </div>
  );
}