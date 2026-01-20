// src/components/StatsRankings.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayerDB, PlayerStatsDB } from '@/types';

export function StatsRankings({ players, playerStats }: { players: PlayerDB[], playerStats: PlayerStatsDB[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top HR */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Top Home Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {players
              .map((player) => ({
                ...player,
                stats: playerStats.find((s) => s.player_id === player.id),
              }))
              .sort((a, b) => (b.stats?.home_runs || 0) - (a.stats?.home_runs || 0))
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
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {player.stats?.home_runs || 0}
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
            {players
              .map((player) => ({
                ...player,
                stats: playerStats.find((s) => s.player_id === player.id),
              }))
              .sort((a, b) => (b.stats?.batting_average || 0) - (a.stats?.batting_average || 0))
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
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    .{((player.stats?.batting_average || 0) * 1000).toFixed(0)}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}