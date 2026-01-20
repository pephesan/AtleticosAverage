// src/app/page.tsx
import { mockPlayers, mockPlayerStats, mockTeamStats } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            ⚾ Atléticos
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Estadísticas del equipo 2026
          </p>
        </div>

        {/* Team Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Récord</CardDescription>
              <CardTitle className="text-3xl">
                {mockTeamStats.wins}-{mockTeamStats.losses}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Promedio del Equipo</CardDescription>
              <CardTitle className="text-3xl">
                .{(mockTeamStats.teamBattingAverage * 1000).toFixed(0)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Carreras Totales</CardDescription>
              <CardTitle className="text-3xl">{mockTeamStats.totalRuns}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Hits Totales</CardDescription>
              <CardTitle className="text-3xl">{mockTeamStats.totalHits}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Players List */}
        <Card>
          <CardHeader>
            <CardTitle>Roster de Jugadores</CardTitle>
            <CardDescription>Estadísticas individuales de la temporada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPlayers.map((player) => {
                const stats = mockPlayerStats.find((s) => s.playerId === player.id);
                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                        {player.number}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{player.name}</p>
                        <p className="text-sm text-muted-foreground">{player.position}</p>
                      </div>
                    </div>
                    <div className="flex gap-6 items-center">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">AVG</p>
                        <p className="text-lg font-bold">.{((stats?.battingAverage || 0) * 1000).toFixed(0)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">HR</p>
                        <p className="text-lg font-bold">{stats?.homeRuns || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">RBI</p>
                        <p className="text-lg font-bold">{stats?.rbi || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">H</p>
                        <p className="text-lg font-bold">{stats?.hits || 0}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}