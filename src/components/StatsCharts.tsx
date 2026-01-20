// src/components/StatsCharts.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PlayerDB, PlayerStatsDB } from '@/types';

export function StatsCharts({ players, playerStats }: { players: PlayerDB[], playerStats: PlayerStatsDB[] }) {
  // Preparar datos para gráfica de Home Runs
  const homeRunsData = players.map((player) => {
    const stats = playerStats.find((s) => s.player_id === player.id);
    return {
      name: player.name.split(' ')[0], // Solo primer nombre
      HR: stats?.home_runs || 0,
      RBI: stats?.rbi || 0,
    };
  });

  // Preparar datos para gráfica de Batting Average
  const battingAvgData = players.map((player) => {
    const stats = playerStats.find((s) => s.player_id === player.id);
    return {
      name: player.name.split(' ')[0],
      AVG: stats?.batting_average || 0,
      OBP: stats?.on_base_percentage || 0,
      SLG: stats?.slugging_percentage || 0,
    };
  });

  return (
    <>
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
    </>
  );
}