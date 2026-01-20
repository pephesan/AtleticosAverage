// src/app/games/page.tsx
'use client';

import { mockGames, mockTeamStats } from '../../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

export default function GamesPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Separar juegos pasados y próximos
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastGames = mockGames
    .filter((game) => new Date(game.date) < today && game.scoreUs > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcomingGames = mockGames
    .filter((game) => new Date(game.date) >= today || game.scoreUs === 0)
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          📅 Juegos
        </h1>
        <p className="text-slate-600 text-lg">
          Calendario y resultados de la temporada
        </p>
      </div>

      {/* Team Record Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Récord General</CardDescription>
            <CardTitle className="text-3xl">
              {mockTeamStats.wins}W - {mockTeamStats.losses}L
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Porcentaje</CardDescription>
            <CardTitle className="text-3xl">
              {((mockTeamStats.wins / (mockTeamStats.wins + mockTeamStats.losses)) * 100).toFixed(1)}%
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
                        {game.scoreUs} - {game.scoreThem}
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
                {upcomingGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-blue-50/50 hover:bg-blue-100/50 transition-colors"
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Calendario */}
        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Calendario de Juegos</CardTitle>
                <CardDescription>Selecciona una fecha para ver juegos</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Game Stats Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen por Ubicación</CardTitle>
                <CardDescription>Rendimiento local vs visitante</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Home Games */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">🏠 Juegos Locales</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-lg bg-green-100">
                      <p className="text-2xl font-bold text-green-700">
                        {pastGames.filter(g => g.location === 'home' && g.result === 'W').length}
                      </p>
                      <p className="text-xs text-green-600">Victorias</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-100">
                      <p className="text-2xl font-bold text-red-700">
                        {pastGames.filter(g => g.location === 'home' && g.result === 'L').length}
                      </p>
                      <p className="text-xs text-red-600">Derrotas</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100">
                      <p className="text-2xl font-bold text-gray-700">
                        {pastGames.filter(g => g.location === 'home' && g.result === 'T').length}
                      </p>
                      <p className="text-xs text-gray-600">Empates</p>
                    </div>
                  </div>
                </div>

                {/* Away Games */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">✈️ Juegos de Visitante</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-lg bg-green-100">
                      <p className="text-2xl font-bold text-green-700">
                        {pastGames.filter(g => g.location === 'away' && g.result === 'W').length}
                      </p>
                      <p className="text-xs text-green-600">Victorias</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-100">
                      <p className="text-2xl font-bold text-red-700">
                        {pastGames.filter(g => g.location === 'away' && g.result === 'L').length}
                      </p>
                      <p className="text-xs text-red-600">Derrotas</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100">
                      <p className="text-2xl font-bold text-gray-700">
                        {pastGames.filter(g => g.location === 'away' && g.result === 'T').length}
                      </p>
                      <p className="text-xs text-gray-600">Empates</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}