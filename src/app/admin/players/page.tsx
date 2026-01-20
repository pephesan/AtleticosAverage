// src/app/admin/players/page.tsx
import { getPlayers, getPlayerStats } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AddPlayerDialog } from '@/components/admin/AddPlayerDialog';
import { EditPlayerDialog } from '@/components/admin/EditPlayerDialog';
import { DeletePlayerDialog } from '@/components/admin/DeletePlayerDialog';

export const dynamic = 'force-dynamic';

export default async function AdminPlayersPage() {
  const players = await getPlayers();
  const playerStats = await getPlayerStats();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Gestión de Jugadores</h1>
          <p className="text-muted-foreground mt-2">
            Agregar, editar o eliminar jugadores del roster
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">← Volver al Admin</Button>
        </Link>
      </div>

      {/* Add Player Button */}
      <div className="flex justify-end">
        <AddPlayerDialog />
      </div>

      {/* Players List */}
      <div className="grid grid-cols-1 gap-4">
        {players.map((player) => {
          const stats = playerStats.find((s) => s.player_id === player.id);
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
                  <div className="flex gap-2">
                    <EditPlayerDialog player={player} />
                    <DeletePlayerDialog player={player} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">AVG</p>
                    <p className="text-xl font-bold">
                      .{((stats?.batting_average || 0) * 1000).toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HR</p>
                    <p className="text-xl font-bold">{stats?.home_runs || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RBI</p>
                    <p className="text-xl font-bold">{stats?.rbi || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hits</p>
                    <p className="text-xl font-bold">{stats?.hits || 0}</p>
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