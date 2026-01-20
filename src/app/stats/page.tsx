// src/app/stats/page.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPlayers, mockPlayerStats, mockTeamStats } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function StatsPage() {
  // Preparar datos para gráfica de Home Runs
  const homeRunsData = mockPlayers.map((player) => {
    const stats = mockPlayerStats.find((s) => s.playerId === player.id);
    return {
      name: player.name.split(' ')[0], // Solo primer nombre
      HR: stats?.homeRuns || 0,
      RBI: stats?.rbi || 0,
    };
  });

  // Preparar datos para gráfica de Batting Average
  const battingAvgData = mockPlayers.map((player) => {
    const stats = mockPlayerStats.find((s) => s.playerId === player.id);
    return {
      name: player.name.split(' ')[0],
      AVG: stats?.battingAverage || 0,
      OBP: stats?.onBasePercentage || 0,
      SLG: stats?.sluggingPercentage || 0,
    };
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          📊 Estadísticas
        </h1>
        <p className="text-slate-600 text-lg">
          Análisis visual del rendimiento del equipo
        </p>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
          <TabsTrigger value="charts">Gráficas</TabsTrigger>
          <TabsTrigger value="compare">Comparar</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
        </TabsList>

        {/* Tab 1: Gráficas */}
        <TabsContent value="charts" className="space-y-6 mt-6">
          {/* Home Runs Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Home Runs y RBI por Jugador</CardTitle>
              <CardDescription>Comparación de poder ofensivo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={homeRunsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="HR" fill="#3b82f6" name="Home Runs" />
                  <Bar dataKey="RBI" fill="#06b6d4" name="RBI" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Batting Average Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Promedio de Bateo (AVG, OBP, SLG)</CardTitle>
              <CardDescription>Métricas ofensivas avanzadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={battingAvgData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 0.6]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="AVG" stroke="#3b82f6" strokeWidth={2} name="Batting AVG" />
                  <Line type="monotone" dataKey="OBP" stroke="#10b981" strokeWidth={2} name="On-Base %" />
                  <Line type="monotone" dataKey="SLG" stroke="#f59e0b" strokeWidth={2} name="Slugging %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Comparar Jugadores */}
        <TabsContent value="compare" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparación de Jugadores</CardTitle>
              <CardDescription>Análisis comparativo de rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                🚧 Función de comparación - Próximamente
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Rankings */}
        <TabsContent value="rankings" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top HR */}
            <Card>
              <CardHeader>
                <CardTitle>🏆 Top Home Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPlayers
                    .map((player) => ({
                      ...player,
                      stats: mockPlayerStats.find((s) => s.playerId === player.id),
                    }))
                    .sort((a, b) => (b.stats?.homeRuns || 0) - (a.stats?.homeRuns || 0))
                    .slice(0, 5)
                    .map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-muted-foreground w-8">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-semibold">{player.name}</p>
                            <p className="text-sm text-muted-foreground">{player.position}</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">
                          {player.stats?.homeRuns || 0}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Top AVG */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Top Batting Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPlayers
                    .map((player) => ({
                      ...player,
                      stats: mockPlayerStats.find((s) => s.playerId === player.id),
                    }))
                    .sort((a, b) => (b.stats?.battingAverage || 0) - (a.stats?.battingAverage || 0))
                    .slice(0, 5)
                    .map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-muted-foreground w-8">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-semibold">{player.name}</p>
                            <p className="text-sm text-muted-foreground">{player.position}</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-green-600">
                          .{((player.stats?.battingAverage || 0) * 1000).toFixed(0)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}