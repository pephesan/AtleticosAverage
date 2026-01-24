// src/hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState<string | null>(null);
  
    useEffect(() => {
      // Verificar si está autenticado
      const auth = localStorage.getItem('isAuthenticated');
      const user = localStorage.getItem('adminUser');
      
      setIsAuthenticated(auth === 'true');
      setUserName(user);
      setIsLoading(false);
    }, []);
  
    return { isAuthenticated, isLoading, userName };
  }