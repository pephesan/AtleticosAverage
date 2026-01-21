// src/app/finanzas/registrar-pago/page.tsx
import { Suspense } from 'react';
import { RegistrarPagoForm } from '@/components/finance/RegistrarPagoForm';

export const dynamic = 'force-dynamic';

export default function RegistrarPagoPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6">Cargando formulario...</div>}>
      <RegistrarPagoForm />
    </Suspense>
  );
}