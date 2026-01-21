// src/app/finanzas/page.tsx
import { getPaymentConcepts, getPayments, getPlayers, getFinanceStats } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ConceptsFilter } from '@/components/finance/ConceptsFilter';

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
      totalPlayers: players.length,
      percentage: concept.total_amount > 0 ? (totalPaid / concept.total_amount) * 100 : 0,
    };
  });

  // Calcular estado por jugador
  const playerStats = players.map((player) => {
    const playerPayments = payments.filter((p) => p.player_id === player.id);
    const totalPaid = playerPayments.reduce((sum, p) => sum + p.amount_paid, 0);
    
    // Calcular cuánto debe en total
    const activeConcepts = concepts.filter((c) => c.status === 'active');
    const totalExpected = activeConcepts.reduce((sum, c) => sum + c.amount_per_player, 0);
    
    // Ver qué ha pagado ya
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
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          💰 Finanzas
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Control de aportaciones y pagos del equipo
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Recaudado</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              ${stats.totalCollected.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Esperado</CardDescription>
            <CardTitle className="text-3xl">
              ${stats.totalExpected.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pendiente</CardDescription>
            <CardTitle className="text-3xl text-orange-600">
              ${stats.totalPending.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Jugadores al Corriente</CardDescription>
            <CardTitle className="text-3xl">
              {playersUpToDate}/{stats.totalPlayers}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Conceptos de Pago */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conceptos de Pago</CardTitle>
              <CardDescription>Aportaciones por mantenimiento, uniformes, etc.</CardDescription>
            </div>
            <Button asChild>
              <Link href="/finanzas/nuevo-concepto">+ Nuevo Concepto</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <ConceptsFilter />

          {/* Lista de conceptos */}
          <div className="space-y-4">
            {conceptsWithStats.map((concept) => (
              <div
                key={concept.id}
                className="p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(concept.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{concept.name}</h3>
                      {concept.description && (
                        <p className="text-sm text-muted-foreground">{concept.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={concept.status === 'active' ? 'default' : 'secondary'}>
                    {concept.status === 'active' ? 'Activo' : 'Completado'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-semibold">${concept.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Por jugador</p>
                    <p className="font-semibold">${concept.amount_per_player.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recaudado</p>
                    <p className="font-semibold text-green-600">
                      ${concept.totalPaid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Jugadores</p>
                    <p className="font-semibold">
                      {concept.playersPaid}/{concept.totalPlayers}
                    </p>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progreso</span>
                    <span>{concept.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(concept.percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/finanzas/concepto/${concept.id}`}>Ver Detalles</Link>
                  </Button>
                  {concept.status === 'active' && (
                    <Button variant="default" size="sm" asChild>
                      <Link href={`/finanzas/registrar-pago?concepto=${concept.id}`}>
                        Registrar Pago
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {conceptsWithStats.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No hay conceptos que coincidan con los filtros
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estado por Jugador */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Cuenta por Jugador</CardTitle>
          <CardDescription>Resumen de pagos y pendientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {playerStats
              .sort((a, b) => b.pendingAmount - a.pendingAmount)
              .map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                      {player.number}
                    </div>
                    <div>
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Pagado: ${player.totalPaid.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Pendiente</p>
                      <p
                        className={`text-lg font-bold ${
                          player.pendingAmount === 0 ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        ${player.pendingAmount.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={player.status === 'al-corriente' ? 'default' : 'destructive'}>
                      {player.status === 'al-corriente' ? '✓ Al corriente' : '⚠ Pendiente'}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}