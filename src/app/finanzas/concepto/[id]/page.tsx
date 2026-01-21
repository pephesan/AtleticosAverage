// src/app/finanzas/concepto/[id]/page.tsx
import { getPaymentConceptById, getPaymentsByConceptId, getPlayers } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeletePaymentButton } from '@/components/finance/DeletePaymentButton';
import { CompleteConceptButton } from '@/components/finance/CompleteConceptButton';

export const dynamic = 'force-dynamic';

// CAMBIO CRÍTICO: params es Promise<{ id: string }> en Next.js 15
export default async function ConceptoDetallePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // AWAIT params antes de usarlo
  const { id } = await params;
  const conceptId = parseInt(id);
  
  const concept = await getPaymentConceptById(conceptId);

  if (!concept) {
    notFound();
  }

  const payments = await getPaymentsByConceptId(conceptId);
  const allPlayers = await getPlayers();

  // Calcular totales
  const totalPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);
  const playersPaid = new Set(payments.map((p) => p.player_id));
  const playersNotPaid = allPlayers.filter((p) => !playersPaid.has(p.id));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const percentage = concept.total_amount > 0 ? (totalPaid / concept.total_amount) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
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
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{concept.name}</CardTitle>
              {concept.description && (
                <CardDescription className="mt-2">{concept.description}</CardDescription>
              )}
            </div>
            <Badge variant={concept.status === 'active' ? 'default' : concept.status === 'completed' ? 'secondary' : 'destructive'}>
              {concept.status === 'active' ? 'Activo' : concept.status === 'completed' ? 'Completado' : 'Cancelado'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Monto Total</p>
              <p className="text-2xl font-bold">${concept.total_amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Por Jugador</p>
              <p className="text-2xl font-bold">${concept.amount_per_player.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recaudado</p>
              <p className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendiente</p>
              <p className="text-2xl font-bold text-orange-600">
                ${(concept.total_amount - totalPaid).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progreso de Recaudación</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          {concept.due_date && (
            <div className="mt-4 text-sm text-muted-foreground">
              Fecha límite: {formatDate(concept.due_date)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Jugadores que YA pagaron */}
      <Card>
        <CardHeader>
          <CardTitle>Jugadores que Pagaron ({playersPaid.size})</CardTitle>
          <CardDescription>Lista de pagos recibidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {payments.map((payment: any) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold">{payment.players.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(payment.payment_date)} • {payment.payment_method}
                    </p>
                    {payment.notes && (
                      <p className="text-xs text-muted-foreground italic">{payment.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${payment.amount_paid.toLocaleString()}
                    </p>
                  </div>
                  <DeletePaymentButton 
                    paymentId={payment.id} 
                    playerName={payment.players.name}
                    amount={payment.amount_paid}
                  />
                </div>
              </div>
            ))}

            {payments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Aún no hay pagos registrados
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Jugadores que NO han pagado */}
      {playersNotPaid.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Jugadores Pendientes ({playersNotPaid.length})</CardTitle>
            <CardDescription>Aún no han realizado el pago</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {playersNotPaid.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-orange-50 dark:bg-orange-950/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                      {player.number}
                    </div>
                    <div>
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      ${concept.amount_per_player.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">pendiente</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botón para registrar pago */}
      {concept.status === 'active' && (
        <Button size="lg" className="w-full" asChild>
          <Link href={`/finanzas/registrar-pago?concepto=${conceptId}`}>
            + Registrar Nuevo Pago
          </Link>
        </Button>
      )}
    </div>
  );
}