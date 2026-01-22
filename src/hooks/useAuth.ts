// src/hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si está autenticado
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true');
    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
}