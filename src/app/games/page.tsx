// src/app/games/page.tsx
import { getGames, getTeamStats } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GamesCalendar } from '@/components/GamesCalendar';

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
      return gameDate < today && game.score_us > 0;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcomingGames = allGames
    .filter((game) => {
      const gameDate = new Date(game.date);
      return gameDate >= today || game.score_us === 0;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!teamStats) {
    return <div>Error cargando datos</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          📅 Juegos
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Calendario y resultados de la temporada
        </p>
      </div>

      {/* Team Record Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Récord General</CardDescription>
            <CardTitle className="text-3xl">
              {teamStats.wins}W - {teamStats.losses}L
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Porcentaje</CardDescription>
            <CardTitle className="text-3xl">
              {((teamStats.wins / (teamStats.wins + teamStats.losses)) * 100).toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Racha</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              3W 🔥
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>

        {/* Tab 1: Resultados Pasados */}
        <TabsContent value="results" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Recientes</CardTitle>
              <CardDescription>Últimos juegos completados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pastGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={game.result === 'W' ? 'default' : game.result === 'L' ? 'destructive' : 'secondary'}>
                        {game.result}
                      </Badge>
                      <div>
                        <p className="font-semibold text-lg">vs {game.opponent}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(game.date)} • {game.location === 'home' ? '🏠 Local' : '✈️ Visitante'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {game.score_us} - {game.score_them}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {game.result === 'W' ? 'Victoria' : game.result === 'L' ? 'Derrota' : 'Empate'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Próximos Juegos */}
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Partidos</CardTitle>
              <CardDescription>Juegos programados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingGames.length > 0 ? (
                  upcomingGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-bold">VS</span>
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{game.opponent}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(game.date)} • {game.location === 'home' ? '🏠 Local' : '✈️ Visitante'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Programado</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay juegos programados
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Calendario */}
        <TabsContent value="calendar" className="mt-6">
          <GamesCalendar pastGames={pastGames} />
        </TabsContent>
      </Tabs>
    </div>
  );
}