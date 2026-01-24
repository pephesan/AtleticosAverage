// src/components/ScorecardButton.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ScorecardButton({ gameId }: { gameId: number }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Link href={`/games/${gameId}/scorecard`}>
      <Button variant="outline" size="sm" className="gap-2">
        📋 Scorecard
      </Button>
    </Link>
  );
}