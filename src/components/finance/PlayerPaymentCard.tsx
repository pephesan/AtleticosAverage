// src/components/finance/PlayerPaymentCard.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { DeletePaymentButton } from './DeletePaymentButton';

interface PlayerPaymentCardProps {
  playerPayment: {
    player: any;
    payments: any[];
    totalPaid: number;
    amountDue: number;
    status: 'complete' | 'partial' | 'pending';
  };
  conceptId: number;
  conceptName: string;
  amountPerPlayer: number;
  isActive: boolean;
}

export function PlayerPaymentCard({ 
  playerPayment, 
  conceptId, 
  conceptName,
  amountPerPlayer,
  isActive 
}: PlayerPaymentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { player, payments, totalPaid, amountDue, status } = playerPayment;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const statusConfig = {
    complete: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-200 dark:border-green-800',
      badge: 'bg-green-500',
      icon: '✓',
      text: 'Completo',
    },
    partial: {
      bg: 'bg-yellow-50 dark:bg-yellow-950/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      badge: 'bg-yellow-500',
      icon: '⚠',
      text: 'Parcial',
    },
    pending: {
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      border: 'border-orange-200 dark:border-orange-800',
      badge: 'bg-orange-500',
      icon: '⏳',
      text: 'Pendiente',
    },
  };

  const config = statusConfig[status];

  return (
    <Card className={`border-2 ${config.border} ${config.bg} transition-all hover:shadow-lg`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${config.badge} flex items-center justify-center text-white font-black text-lg`}>
              {player.number}
            </div>
            <div>
              <p className="font-bold text-lg">{player.name}</p>
              <p className="text-sm text-muted-foreground">{player.position}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={`${config.badge} text-white border-0`}>
              {config.icon} {config.text}
            </Badge>
            {payments.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Resumen de Pago */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">
              ${amountPerPlayer.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
            <p className="text-xs text-muted-foreground mb-1">Pagado</p>
            <p className="text-xl font-black text-green-600 dark:text-green-400">
              ${totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
            <p className="text-xs text-muted-foreground mb-1">Debe</p>
            <p className="text-xl font-black text-orange-600 dark:text-orange-400">
              ${amountDue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Historial de Abonos (Expandible) */}
        {expanded && payments.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <p className="text-sm font-bold text-muted-foreground mb-3">
              Historial de Abonos ({payments.length})
            </p>
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 border"
              >
                <div>
                  <p className="font-semibold text-sm">
                    ${payment.amount_paid.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(payment.payment_date)} • {payment.payment_method}
                  </p>
                  {payment.notes && (
                    <p className="text-xs text-muted-foreground italic mt-1">{payment.notes}</p>
                  )}
                </div>
                <DeletePaymentButton
                  paymentId={payment.id}
                  playerName={player.name}
                  amount={payment.amount_paid}
                />
              </div>
            ))}
          </div>
        )}

        {/* Botón de Abonar */}
        {isActive && amountDue > 0 && (
          <Button
            size="sm"
            className="w-full mt-3 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            asChild
          >
            <Link href={`/finanzas/registrar-pago?concepto=${conceptId}&jugador=${player.id}`}>
              <Plus className="w-4 h-4" />
              Abonar ${amountDue.toLocaleString()}
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}