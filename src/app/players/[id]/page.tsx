// src/app/players/[id]/page.tsx
'use client';

import { use } from 'react';
import { mockPlayers, mockPlayerStats, mockGames } from '../../../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const playerId = parseInt(id);
  
  const player = mockPlayers.find((p) => p.id === playerId);
  const stats = mockPlayerStats.find((s) => s.playerId === playerId);

  if (!player || !stats) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Jugador no encontrado</h1>
        <Link href="/players">
          <Button className="mt-4">Volver a Jugadores</Button>
        </Link>
      </div>
    );
  }

  // Datos para gráfica individual
  const playerChartData = [
    { stat: 'H', value: stats.hits },
    { stat: '2B', value: stats.doubles },
    { stat: '3B', value: stats.triples },
    { stat: 'HR', value: stats.homeRuns },
    { stat: 'RBI', value: stats.rbi },
    { stat: 'BB', value: stats.walks },
    { stat: 'SO', value: stats.strikeouts },
    { stat: 'SB', value: stats.stolenBases },
  ];

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
              .{(stats.battingAverage * 1000).toFixed(0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Home Runs</CardDescription>
            <CardTitle className="text-3xl">{stats.homeRuns}</CardTitle>
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
            <CardTitle className="text-3xl">{stats.gamesPlayed}</CardTitle>
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
                    <span className="font-semibold">{stats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Turnos al Bate:</span>
                    <span className="font-semibold">{stats.atBats}</span>
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
                    <span className="font-semibold">{stats.homeRuns}</span>
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
                    <span className="font-semibold">.{(stats.battingAverage * 1000).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">On-Base %:</span>
                    <span className="font-semibold">.{(stats.onBasePercentage * 1000).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slugging %:</span>
                    <span className="font-semibold">.{(stats.sluggingPercentage * 1000).toFixed(0)}</span>
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
                    <span className="font-semibold">{stats.stolenBases}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Gráficas */}
        <TabsContent value="charts" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Estadísticas</CardTitle>
              <CardDescription>Análisis visual del rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={playerChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stat" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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
                {mockGames.slice(0, 5).map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-semibold">{game.opponent}</p>
                      <p className="text-sm text-muted-foreground">{game.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">
                        {game.scoreUs} - {game.scoreThem}
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