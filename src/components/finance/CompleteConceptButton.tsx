// src/components/finance/CompleteConceptButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CheckCircle2 } from 'lucide-react';
import { updatePaymentConcept } from '@/lib/supabase-queries';

interface CompleteConceptButtonProps {
  conceptId: number;
  conceptName: string;
  currentStatus: string;
}

export function CompleteConceptButton({ conceptId, conceptName, currentStatus }: CompleteConceptButtonProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleComplete = async () => {
    setIsUpdating(true);
    try {
      await updatePaymentConcept(conceptId, { status: 'completed' });
      router.refresh();
    } catch (error) {
      console.error('Error completing concept:', error);
      alert('Error al marcar como completado');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReopen = async () => {
    setIsUpdating(true);
    try {
      await updatePaymentConcept(conceptId, { status: 'active' });
      router.refresh();
    } catch (error) {
      console.error('Error reopening concept:', error);
      alert('Error al reabrir concepto');
    } finally {
      setIsUpdating(false);
    }
  };

  if (currentStatus === 'completed') {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            Reabrir
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reabrir este concepto?</AlertDialogTitle>
            <AlertDialogDescription>
              El concepto <strong>{conceptName}</strong> volverá a estar activo y aparecerá en el dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReopen} disabled={isUpdating}>
              {isUpdating ? 'Reabriendo...' : 'Reabrir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Marcar Completado
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Marcar como completado?</AlertDialogTitle>
          <AlertDialogDescription>
            El concepto <strong>{conceptName}</strong> se marcará como completado y ya no aparecerá en los conceptos activos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleComplete} disabled={isUpdating}>
            {isUpdating ? 'Marcando...' : 'Marcar Completado'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}