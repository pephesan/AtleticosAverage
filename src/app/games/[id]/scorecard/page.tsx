// src/app/games/[id]/scorecard/page.tsx
import { Suspense } from 'react';
import { ScorecardView } from '@/components/scorecard/ScorecardView';

export const dynamic = 'force-dynamic';

export default async function ScorecardPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando scorecard...</p>
        </div>
      </div>
    }>
      <ScorecardView gameId={id} />
    </Suspense>
  );
}