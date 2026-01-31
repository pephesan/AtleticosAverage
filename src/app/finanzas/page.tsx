// src/app/finanzas/page.tsx
import { getPaymentConcepts, getPayments, getPlayers, getFinanceStats } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DollarSign, TrendingUp, Users, AlertCircle, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { ConceptsFilter } from '@/components/finance/ConceptsFilter';
import { DeleteConceptButton } from '@/components/finance/DeleteConceptButton';

export const dynamic = 'force-dynamic';

export default async function FinanzasPage({
  searchParams,
}: {
  searchParams: { tipo?: string; estado?: string };
}) {
  const concepts = await getPaymentConcepts();
  const payments = await getPayments();
  const players = await getPlayers();
  const stats = await getFinanceStats();

  // Filtrar conceptos
  let filteredConcepts = concepts;

  if (searchParams.tipo && searchParams.tipo !== 'all') {
    filteredConcepts = filteredConcepts.filter((c) => c.type === searchParams.tipo);
  }

  if (searchParams.estado && searchParams.estado !== 'all') {
    filteredConcepts = filteredConcepts.filter((c) => c.status === searchParams.estado);
  }

  // Calcular pagos por concepto
  const conceptsWithStats = filteredConcepts.map((concept) => {
    const conceptPayments = payments.filter((p) => p.concept_id === concept.id);
    const totalPaid = conceptPayments.reduce((sum, p) => sum + p.amount_paid, 0);
    const playersPaid = new Set(conceptPayments.map((p) => p.player_id)).size;

    return {
      ...concept,
      totalPaid,
      playersPaid,
      paymentsCount: conceptPayments.length,
      totalPlayers: players.length,
      percentage: concept.total_amount > 0 ? (totalPaid / concept.total_amount) * 100 : 0,
    };
  });

  // Calcular estado por jugador
  const playerStats = players.map((player) => {
    const playerPayments = payments.filter((p) => p.player_id === player.id);
    const totalPaid = playerPayments.reduce((sum, p) => sum + p.amount_paid, 0);
    
    const activeConcepts = concepts.filter((c) => c.status === 'active');
    const totalExpected = activeConcepts.reduce((sum, c) => sum + c.amount_per_player, 0);
    
    const paidConcepts = new Set(playerPayments.map((p) => p.concept_id));
    const pendingAmount = activeConcepts
      .filter((c) => !paidConcepts.has(c.id))
      .reduce((sum, c) => sum + c.amount_per_player, 0);

    return {
      ...player,
      totalPaid,
      totalExpected,
      pendingAmount,
      status: pendingAmount === 0 ? 'al-corriente' : 'pendiente',
    };
  });

  const playersUpToDate = playerStats.filter((p) => p.status === 'al-corriente').length;

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      game: '🏟️',
      uniform: '👕',
      equipment: '⚾',
      tournament: '🏆',
      other: '📋',
    };
    return icons[type] || '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white">
                Finanzas
              </h1>
              <p className="text-muted-foreground">Control de aportaciones del equipo</p>
            </div>
          </div>
          <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
            <Link href="/finanzas/nuevo-concepto">
              <Plus className="w-4 h-4" />
              Nuevo Concepto
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 opacity-80" />
                <Badge className="bg-white/20 border-0 text-white">
                  ✓ Recaudado
                </Badge>
              </div>
              <p className="text-5xl font-black mb-1">
                ${stats.totalCollected.toLocaleString()}
              </p>
              <p className="text-green-100 font-medium">Total Recaudado</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-5xl font-black mb-1">
                ${stats.totalExpected.toLocaleString()}
              </p>
              <p className="text-blue-100 font-medium">Total Esperado</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-5xl font-black mb-1">
                ${stats.totalPending.toLocaleString()}
              </p>
              <p className="text-orange-100 font-medium">Pendiente</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-5xl font-black mb-1">
                {playersUpToDate}/{stats.totalPlayers}
              </p>
              <p className="text-purple-100 font-medium">Al Corriente</p>
            </CardContent>
          </Card>
        </div>

        {/* Conceptos de Pago */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Conceptos de Pago</CardTitle>
                <CardDescription>Aportaciones registradas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filtros */}
            <ConceptsFilter />

            {/* Lista de conceptos */}
            <div className="space-y-4">
              {conceptsWithStats.map((concept) => (
                <div key={concept.id} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  
                  <Card className="relative border-2 hover:border-green-500 transition-all hover:shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getTypeIcon(concept.type)}</span>
                          <div>
                            <h3 className="font-black text-xl group-hover:text-green-600 transition-colors">
                              {concept.name}
                            </h3>
                            {concept.description && (
                              <p className="text-sm text-muted-foreground mt-1">{concept.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={concept.status === 'active' ? 'default' : 'secondary'}>
                            {concept.status === 'active' ? '✓ Activo' : '✔ Completado'}
                          </Badge>
                          <DeleteConceptButton
                            conceptId={concept.id}
                            conceptName={concept.name}
                            paymentsCount={concept.paymentsCount}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-xs text-muted-foreground mb-1">Total</p>
                          <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                            ${concept.total_amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-xs text-muted-foreground mb-1">Por jugador</p>
                          <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                            ${concept.amount_per_player.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-xs text-muted-foreground mb-1">Recaudado</p>
                          <p className="text-xl font-black text-green-600 dark:text-green-400">
                            ${concept.totalPaid.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-xs text-muted-foreground mb-1">Jugadores</p>
                          <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                            {concept.playersPaid}/{concept.totalPlayers}
                          </p>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Progreso</span>
                          <span className="font-bold">{concept.percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(concept.percentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link href={`/finanzas/concepto/${concept.id}`}>
                            Ver Detalles
                          </Link>
                        </Button>
                        {concept.status === 'active' && (
                          <Button size="sm" asChild className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                            <Link href={`/finanzas/registrar-pago?concepto=${concept.id}`}>
                              Registrar Pago
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {conceptsWithStats.length === 0 && (
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <CardContent className="py-16 text-center">
                    <DollarSign className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold mb-2">No hay conceptos</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchParams.tipo || searchParams.estado 
                        ? 'No hay conceptos que coincidan con los filtros' 
                        : 'Comienza creando un nuevo concepto de pago'}
                    </p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500">
                      <Link href="/finanzas/nuevo-concepto">
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primer Concepto
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estado por Jugador */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Estado de Cuenta</CardTitle>
                <CardDescription>Resumen por jugador</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {playerStats
                .sort((a, b) => b.pendingAmount - a.pendingAmount)
                .map((player) => (
                  <div
                    key={player.id}
                    className={`
                      flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-lg
                      ${player.status === 'al-corriente' 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                        : 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl text-white
                        ${player.status === 'al-corriente' 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-br from-orange-500 to-red-500'}
                      `}>
                        {player.number}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{player.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Pagado: ${player.totalPaid.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Pendiente</p>
                        <p className={`text-3xl font-black ${
                          player.pendingAmount === 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          ${player.pendingAmount.toLocaleString()}
                        </p>
                      </div>
                      {player.status === 'al-corriente' ? (
                        <CheckCircle2 className="w-10 h-10 text-green-600 shrink-0" />
                      ) : (
                        <XCircle className="w-10 h-10 text-orange-600 shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}