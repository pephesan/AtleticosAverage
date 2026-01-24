// src/app/games/page.tsx
import { getGames, getTeamStats } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Calendar, Trophy, TrendingUp, Target, Home, Plane, Plus } from 'lucide-react';
import { GamesCalendar } from '@/components/GamesCalendar';
import { AuthButton } from '@/components/AuthButton';
import { ScorecardButton } from '@/components/ScorecardButton';

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const allGames = await getGames();
  const teamStats = await getTeamStats();

  // Separar juegos pasados y próximos
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastGames = allGames
    .filter((game) => {
      const gameDate = new Date(game.date);
      return gameDate < today && game.score_us !== null;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcomingGames = allGames
    .filter((game) => {
      const gameDate = new Date(game.date);
      return gameDate >= today || game.score_us === null;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calcular racha actual
  const recentGames = pastGames.slice(0, 10);
  let currentStreak = 0;
  let streakType = '';
  
  for (const game of recentGames) {
    if (currentStreak === 0) {
      currentStreak = 1;
      streakType = game.result || '';
    } else if (game.result === streakType) {
      currentStreak++;
    } else {
      break;
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!teamStats) {
    return <div>Error cargando datos</div>;
  }

  const winPercentage = teamStats.wins / (teamStats.wins + teamStats.losses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white">
                Juegos
              </h1>
              <p className="text-muted-foreground">Calendario y resultados de la temporada</p>
            </div>
          </div>
          <AuthButton>
            <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Link href="/admin/games">
                <Plus className="w-4 h-4" />
                Agregar Juego
              </Link>
            </Button>
          </AuthButton>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Record */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8 opacity-80" />
                <Badge className="bg-white/20 border-0 text-white">
                  {(winPercentage * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-5xl font-black mb-1">
                {teamStats.wins}-{teamStats.losses}
              </p>
              <p className="text-green-100 font-medium">Récord General</p>
            </CardContent>
          </Card>

          {/* Win Percentage */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-5xl font-black mb-1">
                {(winPercentage * 100).toFixed(1)}%
              </p>
              <p className="text-blue-100 font-medium">Efectividad</p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className={`border-0 shadow-xl text-white hover:scale-105 transition-transform ${
            streakType === 'W' 
              ? 'bg-gradient-to-br from-orange-500 to-red-600' 
              : 'bg-gradient-to-br from-slate-500 to-slate-600'
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 opacity-80" />
                <Badge className="bg-white/20 border-0 text-white">
                  Actual
                </Badge>
              </div>
              <p className="text-5xl font-black mb-1">
                {currentStreak}{streakType}
              </p>
              <p className={`font-medium ${streakType === 'W' ? 'text-orange-100' : 'text-slate-200'}`}>
                {streakType === 'W' ? 'Racha de Victorias' : 'Racha de Derrotas'}
              </p>
            </CardContent>
          </Card>

          {/* Next Game */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 opacity-80" />
              </div>
              {upcomingGames.length > 0 ? (
                <>
                  <p className="text-2xl font-black mb-1 truncate">
                    vs {upcomingGames[0].opponent}
                  </p>
                  <p className="text-purple-100 font-medium">
                    {formatDateShort(upcomingGames[0].date)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-black mb-1">Sin juegos</p>
                  <p className="text-purple-100 font-medium">Programados</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[500px] mx-auto h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-lg">
            <TabsTrigger value="results" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Resultados
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Próximos
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Calendario
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Resultados Pasados */}
          <TabsContent value="results" className="space-y-4 mt-6">
            <div className="space-y-4">
              {pastGames.map((game) => (
                <div key={game.id} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  
                  <Card className="relative border-2 hover:border-blue-500 transition-all hover:shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        
                        {/* Result Badge */}
                        <div className={`
                          w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shrink-0
                          ${game.result === 'W' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : ''}
                          ${game.result === 'L' ? 'bg-gradient-to-br from-red-500 to-rose-600' : ''}
                          ${game.result === 'T' ? 'bg-gradient-to-br from-slate-500 to-slate-600' : ''}
                        `}>
                          {game.result}
                        </div>

                        {/* Game Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-xl mb-1 truncate">
                            vs {game.opponent}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatDate(game.date)}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {game.location === 'home' ? (
                                <>
                                  <Home className="w-4 h-4" />
                                  <span>Local</span>
                                </>
                              ) : (
                                <>
                                  <Plane className="w-4 h-4" />
                                  <span>Visitante</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right shrink-0">
                          <p className="text-4xl font-black">
                            {game.score_us} - {game.score_them}
                          </p>
                          <p className="text-sm text-muted-foreground font-medium">
                            {game.result === 'W' ? 'Victoria' : game.result === 'L' ? 'Derrota' : 'Empate'}
                          </p>
                        </div>

                        <ScorecardButton gameId={game.id} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {pastGames.length === 0 && (
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <CardContent className="py-16 text-center">
                    <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold mb-2">No hay resultados</h3>
                    <p className="text-muted-foreground">
                      Aún no hay juegos completados
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Próximos Juegos */}
          <TabsContent value="upcoming" className="space-y-4 mt-6">
            <div className="space-y-4">
              {upcomingGames.map((game) => (
                <div key={game.id} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  
                  <Card className="relative border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 transition-all hover:shadow-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        
                        {/* VS Badge */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shrink-0 text-white font-black text-xl shadow-lg">
                          VS
                        </div>

                        {/* Game Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-xl mb-1 truncate">
                            {game.opponent}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-semibold">{formatDate(game.date)}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {game.location === 'home' ? (
                                <>
                                  <Home className="w-4 h-4" />
                                  <span>Local</span>
                                </>
                              ) : (
                                <>
                                  <Plane className="w-4 h-4" />
                                  <span>Visitante</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <Badge variant="outline" className="border-purple-500 text-purple-700 dark:text-purple-300 shrink-0">
                          Programado
                        </Badge>

                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {upcomingGames.length === 0 && (
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <CardContent className="py-16 text-center">
                    <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold mb-2">No hay juegos programados</h3>
                    <p className="text-muted-foreground mb-6">
                      Agrega el próximo juego de la temporada
                    </p>
                    <AuthButton>
                      <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Link href="/admin/games">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Juego
                        </Link>
                      </Button>
                    </AuthButton>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab 3: Calendario */}
          <TabsContent value="calendar" className="mt-6">
            <GamesCalendar pastGames={pastGames} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}