// src/components/PlayerStatsChart.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlayerStatsDB } from '@/types';

export function PlayerStatsChart({ stats }: { stats: PlayerStatsDB }) {
  const playerChartData = [
    { stat: 'H', value: stats.hits },
    { stat: '2B', value: stats.doubles },
    { stat: '3B', value: stats.triples },
    { stat: 'HR', value: stats.home_runs },
    { stat: 'RBI', value: stats.rbi },
    { stat: 'BB', value: stats.walks },
    { stat: 'SO', value: stats.strikeouts },
    { stat: 'SB', value: stats.stolen_bases },
  ];

  return (
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
  );
}