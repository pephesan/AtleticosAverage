// src/app/admin/stats/page.tsx
import { getPlayers, getPlayerStats } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EditStatsDialog } from '@/components/admin/EditStatsDialog';

export const dynamic = 'force-dynamic';

export default async function AdminStatsPage() {
  const players = await getPlayers();
  const playerStats = await getPlayerStats();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Actualizar Estadísticas</h1>
          <p className="text-muted-foreground mt-2">
            Modifica las estadísticas de los jugadores
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">← Volver al Admin</Button>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">Tip: Actualización de estadísticas</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Las métricas AVG, OBP y SLG se calculan automáticamente basadas en los valores que ingreses.
            </p>
          </div>
        </div>
      </div>

      {/* Players Stats List */}
      <div className="grid grid-cols-1 gap-4">
        {players.map((player) => {
          const stats = playerStats.find((s) => s.player_id === player.id);
          
          if (!stats) return null;

          return (
            <Card key={player.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
                      {player.number}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{player.name}</CardTitle>
                      <CardDescription className="text-base">
                        {player.position} • #{player.number}
                      </CardDescription>
                    </div>
                  </div>
                  <EditStatsDialog player={player} stats={stats} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">GP</p>
                    <p className="text-xl font-bold">{stats.games_played}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AB</p>
                    <p className="text-xl font-bold">{stats.at_bats}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">H</p>
                    <p className="text-xl font-bold">{stats.hits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">2B</p>
                    <p className="text-xl font-bold">{stats.doubles}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">3B</p>
                    <p className="text-xl font-bold">{stats.triples}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HR</p>
                    <p className="text-xl font-bold">{stats.home_runs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RBI</p>
                    <p className="text-xl font-bold">{stats.rbi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">BB</p>
                    <p className="text-xl font-bold">{stats.walks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SO</p>
                    <p className="text-xl font-bold">{stats.strikeouts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SB</p>
                    <p className="text-xl font-bold">{stats.stolen_bases}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AVG</p>
                    <p className="text-xl font-bold">.{(stats.batting_average * 1000).toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">OBP</p>
                    <p className="text-xl font-bold">.{(stats.on_base_percentage * 1000).toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}