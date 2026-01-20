// src/app/admin/games/page.tsx
import { getGames } from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AddGameDialog } from '@/components/admin/AddGameDialog';
import { EditGameDialog } from '@/components/admin/EditGameDialog';
import { DeleteGameDialog } from '@/components/admin/DeleteGameDialog';

export const dynamic = 'force-dynamic';

export default async function AdminGamesPage() {
  const games = await getGames();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Gestión de Juegos</h1>
          <p className="text-muted-foreground mt-2">
            Registrar resultados y programar nuevos juegos
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">← Volver al Admin</Button>
        </Link>
      </div>

      {/* Add Game Button */}
      <div className="flex justify-end">
        <AddGameDialog />
      </div>

      {/* Games List */}
      <div className="grid grid-cols-1 gap-4">
        {games.map((game) => (
          <Card key={game.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant={game.result === 'W' ? 'default' : game.result === 'L' ? 'destructive' : 'secondary'} className="text-lg px-3 py-1">
                    {game.result || 'TBD'}
                  </Badge>
                  <div>
                    <CardTitle className="text-2xl">vs {game.opponent}</CardTitle>
                    <CardDescription className="text-base">
                      {formatDate(game.date)} • {game.location === 'home' ? '🏠 Local' : '✈️ Visitante'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-3xl font-bold">
                      {game.score_us} - {game.score_them}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <EditGameDialog game={game} />
                    <DeleteGameDialog game={game} />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}