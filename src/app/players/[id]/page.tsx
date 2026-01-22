// src/app/players/[id]/page.tsx
import { getPlayerById, getPlayerStatsById } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, TrendingUp, Target, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PlayerStatsChart } from '@/components/PlayerStatsChart';

export const dynamic = 'force-dynamic';

export default async function PlayerDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  // Redirigir rutas administrativas a la sección de admin
  if (id === 'new' || id === 'create' || id === 'add') {
    redirect('/admin/players');
  }
  
  const playerId = parseInt(id);
  
  const player = await getPlayerById(playerId);
  const stats = await getPlayerStatsById(playerId);

  if (!player) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Back Button */}
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/players">
            <ArrowLeft className="w-4 h-4" />
            Volver a Jugadores
          </Link>
        </Button>

        {/* Player Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Player Number */}
                <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                  <span className="text-6xl font-black">{player.number}</span>
                </div>

                {/* Player Info */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2">{player.name}</h1>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/20 backdrop-blur-sm border-0 text-white text-lg px-4 py-1">
                      {player.position}
                    </Badge>
                    {stats && stats.batting_average > 0.300 && (
                      <Badge className="bg-yellow-500 text-white border-0 text-lg px-4 py-1">
                        ⭐ All-Star
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <Button 
                asChild 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0 text-white"
              >
                <Link href={`/players/${playerId}/edit`} className="gap-2">
                  <Edit className="w-4 h-4" />
                  Editar Jugador
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {stats ? (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Batting Average */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-transform">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-8 h-8 opacity-80" />
                  </div>
                  <p className="text-5xl font-black mb-1">
                    .{(stats.batting_average * 1000).toFixed(0)}
                  </p>
                  <p className="text-blue-100 font-medium">Promedio de Bateo</p>
                </CardContent>
              </Card>

              {/* Home Runs */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white hover:scale-105 transition-transform">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-8 h-8 opacity-80" />
                  </div>
                  <p className="text-5xl font-black mb-1">{stats.home_runs}</p>
                  <p className="text-orange-100 font-medium">Home Runs</p>
                </CardContent>
              </Card>

              {/* RBIs */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-transform">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 opacity-80" />
                  </div>
                  <p className="text-5xl font-black mb-1">{stats.rbi}</p>
                  <p className="text-green-100 font-medium">Carreras Impulsadas</p>
                </CardContent>
              </Card>

              {/* Hits */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:scale-105 transition-transform">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-8 h-8 opacity-80" />
                  </div>
                  <p className="text-5xl font-black mb-1">{stats.hits}</p>
                  <p className="text-purple-100 font-medium">Hits Totales</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Offensive Stats */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Estadísticas Ofensivas</CardTitle>
                      <CardDescription>Rendimiento al bat</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <StatItem label="Juegos" value={stats.games_played} />
                    <StatItem label="Turnos al Bat" value={stats.at_bats} />
                    <StatItem label="Hits" value={stats.hits} />
                    <StatItem label="Dobles" value={stats.doubles} />
                    <StatItem label="Triples" value={stats.triples} />
                    <StatItem label="Home Runs" value={stats.home_runs} />
                    <StatItem label="RBI" value={stats.rbi} />
                    <StatItem label="Bases Robadas" value={stats.stolen_bases} />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Stats */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Estadísticas Avanzadas</CardTitle>
                      <CardDescription>Análisis detallado</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <StatItem 
                      label="Promedio" 
                      value={`.${(stats.batting_average * 1000).toFixed(0)}`}
                      highlight
                    />
                    <StatItem 
                      label="OBP" 
                      value={`.${(stats.on_base_percentage * 1000).toFixed(0)}`}
                      highlight
                    />
                    <StatItem 
                      label="SLG" 
                      value={`.${(stats.slugging_percentage * 1000).toFixed(0)}`}
                      highlight
                    />
                    <StatItem 
                      label="OPS" 
                      value={`.${((stats.on_base_percentage + stats.slugging_percentage) * 1000).toFixed(0)}`}
                      highlight
                    />
                    <StatItem label="Walks" value={stats.walks} />
                    <StatItem label="Strikeouts" value={stats.strikeouts} />
                  </div>

                  {/* Performance Bars */}
                  <div className="pt-4 space-y-3">
                    <PerformanceBar 
                      label="Promedio de Bateo" 
                      value={stats.batting_average} 
                      max={0.400}
                      color="blue"
                    />
                    <PerformanceBar 
                      label="On Base %" 
                      value={stats.on_base_percentage} 
                      max={0.500}
                      color="green"
                    />
                    <PerformanceBar 
                      label="Slugging %" 
                      value={stats.slugging_percentage} 
                      max={0.700}
                      color="purple"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <PlayerStatsChart stats={stats} />

          </>
        ) : (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardContent className="py-16 text-center">
              <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Sin Estadísticas</h3>
              <p className="text-muted-foreground mb-6">
                Este jugador aún no tiene estadísticas registradas
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                <Link href={`/stats/add?player=${playerId}`}>
                  + Agregar Estadísticas
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

// Helper Components
function StatItem({ 
  label, 
  value, 
  highlight = false 
}: { 
  label: string; 
  value: number | string; 
  highlight?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
      <p className={`text-2xl font-black ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
    </div>
  );
}

function PerformanceBar({ 
  label, 
  value, 
  max, 
  color 
}: { 
  label: string; 
  value: number; 
  max: number; 
  color: 'blue' | 'green' | 'purple';
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium">{label}</span>
        <span className="font-bold">.{(value * 1000).toFixed(0)}</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}