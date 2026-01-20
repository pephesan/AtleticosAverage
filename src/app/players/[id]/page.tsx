// src/app/players/[id]/page.tsx
import { getPlayerById, getPlayerStatsById, getGames } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerStatsChart } from '@/components/PlayerStatsChart';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playerId = parseInt(id);
  
  const player = await getPlayerById(playerId);
  const stats = await getPlayerStatsById(playerId);
  const games = await getGames();

  if (!player || !stats) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Back Button */}
      <Link href="/players">
        <Button variant="ghost">← Volver a Jugadores</Button>
      </Link>

      {/* Player Header */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-4xl">
          {player.number}
        </div>
        <div>
          <h1 className="text-4xl font-bold">{player.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {player.position}
            </Badge>
            <Badge variant="outline" className="text-lg px-3 py-1">
              #{player.number}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Batting AVG</CardDescription>
            <CardTitle className="text-3xl">
              .{(stats.batting_average * 1000).toFixed(0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Home Runs</CardDescription>
            <CardTitle className="text-3xl">{stats.home_runs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>RBI</CardDescription>
            <CardTitle className="text-3xl">{stats.rbi}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Hits</CardDescription>
            <CardTitle className="text-3xl">{stats.hits}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Games</CardDescription>
            <CardTitle className="text-3xl">{stats.games_played}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="charts">Gráficas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        {/* Tab 1: Estadísticas Detalladas */}
        <TabsContent value="stats" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batting Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Bateo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Juegos Jugados:</span>
                    <span className="font-semibold">{stats.games_played}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Turnos al Bate:</span>
                    <span className="font-semibold">{stats.at_bats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hits:</span>
                    <span className="font-semibold">{stats.hits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dobles:</span>
                    <span className="font-semibold">{stats.doubles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Triples:</span>
                    <span className="font-semibold">{stats.triples}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Home Runs:</span>
                    <span className="font-semibold">{stats.home_runs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RBI:</span>
                    <span className="font-semibold">{stats.rbi}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas Avanzadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Batting Average:</span>
                    <span className="font-semibold">.{(stats.batting_average * 1000).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">On-Base %:</span>
                    <span className="font-semibold">.{(stats.on_base_percentage * 1000).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slugging %:</span>
                    <span className="font-semibold">.{(stats.slugging_percentage * 1000).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bases por Bolas:</span>
                    <span className="font-semibold">{stats.walks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ponches:</span>
                    <span className="font-semibold">{stats.strikeouts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bases Robadas:</span>
                    <span className="font-semibold">{stats.stolen_bases}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Gráficas */}
        <TabsContent value="charts" className="space-y-6 mt-6">
          <PlayerStatsChart stats={stats} />
        </TabsContent>

        {/* Tab 3: Historial */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Juegos</CardTitle>
              <CardDescription>Últimos juegos del equipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {games.slice(0, 5).map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-semibold">{game.opponent}</p>
                      <p className="text-sm text-muted-foreground">{game.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">
                        {game.score_us} - {game.score_them}
                      </span>
                      <Badge variant={game.result === 'W' ? 'default' : 'destructive'}>
                        {game.result}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}