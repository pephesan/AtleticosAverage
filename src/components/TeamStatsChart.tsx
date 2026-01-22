// src/components/TeamStatsChart.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function TeamStatsChart({ playerStats, players }: { playerStats: any[]; players: any[] }) {
  // Top 5 bateadores para la gráfica
  const top5Data = playerStats
    .sort((a, b) => b.batting_average - a.batting_average)
    .slice(0, 5)
    .map((stat) => {
      const player = players.find(p => p.id === stat.player_id);
      return {
        name: player?.name?.split(' ')[0] || 'N/A',
        avg: parseFloat((stat.batting_average * 1000).toFixed(0)),
        hr: stat.home_runs,
        rbi: stat.rbi,
      };
    });

  // Distribución de posiciones
  const positionCount = players.reduce((acc: any, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {});

  const positionData = Object.entries(positionCount).map(([pos, count]) => ({
    position: pos,
    count,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Bar Chart */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Top 5 Bateadores</CardTitle>
              <CardDescription>Comparación de rendimiento</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top5Data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="avg" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Distribución por Posición</CardTitle>
              <CardDescription>Jugadores por posición</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={positionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.position}: ${entry.count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {positionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}