// src/app/finanzas/concepto/[id]/page.tsx
import { getPaymentConceptById, getPaymentsByConceptId, getPlayers } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeletePaymentButton } from '@/components/finance/DeletePaymentButton';
import { CompleteConceptButton } from '@/components/finance/CompleteConceptButton';
import { PlayerPaymentCard } from '@/components/finance/PlayerPaymentCard';

export const dynamic = 'force-dynamic';

export default async function ConceptoDetallePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const conceptId = parseInt(id);
  
  const concept = await getPaymentConceptById(conceptId);

  if (!concept) {
    notFound();
  }

  const payments = await getPaymentsByConceptId(conceptId);
  const allPlayers = await getPlayers();

  // Agrupar pagos por jugador
  const playerPayments = allPlayers.map((player) => {
    const playerPaymentsList = payments.filter((p) => p.player_id === player.id);
    const totalPaid = playerPaymentsList.reduce((sum, p) => sum + p.amount_paid, 0);
    const amountDue = concept.amount_per_player - totalPaid;
    
    let status: 'complete' | 'partial' | 'pending';
    if (totalPaid === 0) {
      status = 'pending';
    } else if (totalPaid >= concept.amount_per_player) {
      status = 'complete';
    } else {
      status = 'partial';
    }

    return {
      player,
      payments: playerPaymentsList,
      totalPaid,
      amountDue: Math.max(0, amountDue),
      status,
    };
  });

  // Ordenar: parciales primero, luego pendientes, luego completos
  const sortedPlayerPayments = playerPayments.sort((a, b) => {
    const statusOrder = { partial: 0, pending: 1, complete: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Calcular totales
  const totalPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);
  const playersComplete = playerPayments.filter((p) => p.status === 'complete').length;
  const playersPartial = playerPayments.filter((p) => p.status === 'partial').length;
  const playersPending = playerPayments.filter((p) => p.status === 'pending').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const percentage = concept.total_amount > 0 ? (totalPaid / concept.total_amount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/finanzas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Finanzas
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/finanzas/editar-concepto/${conceptId}`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <CompleteConceptButton 
              conceptId={conceptId} 
              conceptName={concept.name}
              currentStatus={concept.status}
            />
          </div>
        </div>

        {/* Header del Concepto */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  {concept.name}
                </CardTitle>
                {concept.description && (
                  <CardDescription className="mt-2 text-base">{concept.description}</CardDescription>
                )}
              </div>
              <Badge variant={concept.status === 'active' ? 'default' : 'secondary'} className="text-base px-4 py-1">
                {concept.status === 'active' ? '✓ Activo' : '✔ Completado'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-muted-foreground mb-1">Monto Total</p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  ${concept.total_amount.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-muted-foreground mb-1">Por Jugador</p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  ${concept.amount_per_player.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-muted-foreground mb-1">Recaudado</p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">
                  ${totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-muted-foreground mb-1">Pendiente</p>
                <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                  ${(concept.total_amount - totalPaid).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span className="font-medium">Progreso de Recaudación</span>
                <span className="font-bold">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Resumen de estado */}
            <div className="flex gap-4 mt-6">
              <Badge variant="default" className="bg-green-500 text-white">
                ✓ {playersComplete} Completos
              </Badge>
              {playersPartial > 0 && (
                <Badge variant="default" className="bg-yellow-500 text-white">
                  ⚠ {playersPartial} Parciales
                </Badge>
              )}
              {playersPending > 0 && (
                <Badge variant="default" className="bg-orange-500 text-white">
                  ⏳ {playersPending} Pendientes
                </Badge>
              )}
            </div>

            {concept.due_date && (
              <div className="mt-4 text-sm text-muted-foreground">
                📅 Fecha límite: {formatDate(concept.due_date)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Jugadores con sus Pagos */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Estado de Pagos por Jugador</CardTitle>
            <CardDescription>Detalle de abonos y saldos pendientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedPlayerPayments.map((playerPayment) => (
              <PlayerPaymentCard
                key={playerPayment.player.id}
                playerPayment={playerPayment}
                conceptId={conceptId}
                conceptName={concept.name}
                amountPerPlayer={concept.amount_per_player}
                isActive={concept.status === 'active'}
              />
            ))}
          </CardContent>
        </Card>

        {/* Botón para registrar pago global */}
        {concept.status === 'active' && (
          <Button size="lg" className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" asChild>
            <Link href={`/finanzas/registrar-pago?concepto=${conceptId}`}>
              <Plus className="w-5 h-5" />
              Registrar Nuevo Pago
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}