// src/app/players/page.tsx
import Link from 'next/link';
import { getPlayers, getPlayerStats } from '@/lib/supabase-queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn, FadeInStagger, FadeInStaggerItem } from '@/components/FadeIn';
import { PlayerCardHover } from '@/components/PlayerCardHover';

export const dynamic = 'force-dynamic';

export default async function PlayersPage() {
  const players = await getPlayers();
  const playerStats = await getPlayerStats();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="text-center space-y-2 py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            👥 Jugadores
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Roster completo del equipo
          </p>
        </div>
      </FadeIn>

      {/* Players Grid */}
      <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => {
          const stats = playerStats.find((s) => s.player_id === player.id);
          return (
            <FadeInStaggerItem key={player.id}>
              <PlayerCardHover>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
                          {player.number}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{player.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {player.position}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">AVG</p>
                        <p className="text-lg font-bold">
                          .{((stats?.batting_average || 0) * 1000).toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">HR</p>
                        <p className="text-lg font-bold">{stats?.home_runs || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">RBI</p>
                        <p className="text-lg font-bold">{stats?.rbi || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">H</p>
                        <p className="text-lg font-bold">{stats?.hits || 0}</p>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Link href={`/players/${player.id}`}>
                      <Button className="w-full" variant="outline">
                        Ver Detalles →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </PlayerCardHover>
            </FadeInStaggerItem>
          );
        })}
      </FadeInStagger>
    </div>
  );
}