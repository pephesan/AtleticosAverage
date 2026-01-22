// src/components/AuthButton.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';

export function AuthButton({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras está verificando, no mostrar nada
  if (isLoading) {
    return null;
  }

  // Si no está autenticado, no mostrar el botón
  if (!isAuthenticated) {
    return null;
  }

  // Si está autenticado, mostrar lo que esté dentro
  return <>{children}</>;
}