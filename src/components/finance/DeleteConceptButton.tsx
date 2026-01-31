// src/components/finance/DeleteConceptButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { deletePaymentConcept } from '@/lib/supabase-queries';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // ← IMPORTANTE

interface DeleteConceptButtonProps {
  conceptId: number;
  conceptName: string;
  paymentsCount: number;
}

export function DeleteConceptButton({ conceptId, conceptName, paymentsCount }: DeleteConceptButtonProps) {
  const { isAuthenticated } = useAuth(); // ← IMPORTANTE
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmMessage = paymentsCount > 0
      ? `⚠️ ¿Eliminar "${conceptName}"?\n\nEsto eliminará también ${paymentsCount} pago(s) asociado(s). Esta acción no se puede deshacer.`
      : `¿Eliminar "${conceptName}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    try {
      await deletePaymentConcept(conceptId);
      router.refresh();
    } catch (error) {
      console.error('Error deleting concept:', error);
      alert('Error al eliminar el concepto');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={loading}
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
      title="Eliminar concepto"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}