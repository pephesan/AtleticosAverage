// src/app/admin/players/page.tsx
import Link from 'next/link';
import { getPlayers, getPlayerStats } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowLeft } from 'lucide-react';
import { AddPlayerDialog } from '@/components/admin/AddPlayerDialog';
import { EditPlayerDialog } from '@/components/admin/EditPlayerDialog';
import { DeletePlayerDialog } from '@/components/admin/DeletePlayerDialog';

export const dynamic = 'force-dynamic';

export default async function AdminPlayersPage() {
  const players = await getPlayers();
  const playerStats = await getPlayerStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver al Panel
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Gestión de Jugadores
              </h1>
            </div>
            <p className="text-muted-foreground text-lg ml-16">
              Administra el roster del equipo
            </p>
          </div>
          
          <AddPlayerDialog />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <CardDescription className="text-blue-100 text-sm font-medium">
                Total de Jugadores
              </CardDescription>
              <CardTitle className="text-5xl font-black">
                {players.length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <CardDescription className="text-green-100 text-sm font-medium">
                Con Estadísticas
              </CardDescription>
              <CardTitle className="text-5xl font-black">
                {playerStats.length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <CardDescription className="text-orange-100 text-sm font-medium">
                Sin Estadísticas
              </CardDescription>
              <CardTitle className="text-5xl font-black">
                {players.length - playerStats.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Players List */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Roster Completo</CardTitle>
            <CardDescription>
              {players.length} jugadores registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {players.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg mb-4">
                    No hay jugadores registrados
                  </p>
                  <AddPlayerDialog />
                </div>
              ) : (
                players.map((player) => {
                  const stats = playerStats.find((s) => s.player_id === player.id);
                  
                  return (
                    <div
                      key={player.id}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                      <Card className="relative border-2 hover:border-blue-500 transition-all">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            {/* Player Info */}
                            <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0">
                                {player.number}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-xl">{player.name}</h3>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="secondary">{player.position}</Badge>
                                  {stats ? (
                                    <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                      Con estadísticas
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                                      Sin estadísticas
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Stats Preview */}
                            {stats && (
                              <div className="hidden lg:grid grid-cols-3 gap-6 text-center px-6 border-l border-slate-200 dark:border-slate-700">
                                <div>
                                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                    .{(stats.batting_average * 1000).toFixed(0)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">AVG</p>
                                </div>
                                <div>
                                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                    {stats.home_runs}
                                  </p>
                                  <p className="text-xs text-muted-foreground">HR</p>
                                </div>
                                <div>
                                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                    {stats.rbi}
                                  </p>
                                  <p className="text-xs text-muted-foreground">RBI</p>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <EditPlayerDialog player={player} />
                              <DeletePlayerDialog player={player} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}