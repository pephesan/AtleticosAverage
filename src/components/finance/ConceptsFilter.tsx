// src/components/finance/ConceptsFilter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function ConceptsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTipo = searchParams.get('tipo') || 'all';
  const currentEstado = searchParams.get('estado') || 'active';

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/finanzas?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <Label>Filtrar por Tipo</Label>
        <Select value={currentTipo} onValueChange={(value) => handleFilterChange('tipo', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📋 Todos</SelectItem>
            <SelectItem value="game">🏟️ Mantenimiento/Juego</SelectItem>
            <SelectItem value="uniform">👕 Uniformes</SelectItem>
            <SelectItem value="equipment">⚾ Equipo</SelectItem>
            <SelectItem value="tournament">🏆 Torneo</SelectItem>
            <SelectItem value="other">📋 Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Filtrar por Estado</Label>
        <Select value={currentEstado} onValueChange={(value) => handleFilterChange('estado', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">✅ Activos</SelectItem>
            <SelectItem value="completed">✔️ Completados</SelectItem>
            <SelectItem value="cancelled">❌ Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}