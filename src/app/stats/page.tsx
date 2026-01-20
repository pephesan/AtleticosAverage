// src/app/stats/page.tsx
import { getPlayers, getPlayerStats } from '@/lib/supabase-queries';
import { StatsCharts } from '@/components/StatsCharts';
import { StatsRankings } from '@/components/StatsRankings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const players = await getPlayers();
  const playerStats = await getPlayerStats();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          📊 Estadísticas
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Análisis visual del rendimiento del equipo
        </p>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
          <TabsTrigger value="charts">Gráficas</TabsTrigger>
          <TabsTrigger value="compare">Comparar</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
        </TabsList>

        {/* Tab 1: Gráficas */}
        <TabsContent value="charts" className="space-y-6 mt-6">
          <StatsCharts players={players} playerStats={playerStats} />
        </TabsContent>

        {/* Tab 2: Comparar Jugadores */}
        <TabsContent value="compare" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-12 text-center border-2 border-dashed">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl">🔄</div>
              <h3 className="text-2xl font-bold">Comparación de Jugadores</h3>
              <p className="text-muted-foreground">
                Esta función estará disponible próximamente. Podrás comparar estadísticas de 2 jugadores lado a lado.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Rankings */}
        <TabsContent value="rankings" className="space-y-6 mt-6">
          <StatsRankings players={players} playerStats={playerStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}