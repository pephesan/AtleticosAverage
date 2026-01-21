// src/app/finanzas/nuevo-concepto/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addPaymentConcept } from '@/lib/supabase-queries';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NuevoConceptoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    total_amount: '',
    amount_per_player: '',
    type: 'game',
    due_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addPaymentConcept({
        name: formData.name,
        description: formData.description || undefined,
        total_amount: parseFloat(formData.total_amount),
        amount_per_player: parseFloat(formData.amount_per_player),
        type: formData.type,
        due_date: formData.due_date || undefined,
      });

      router.push('/finanzas');
      router.refresh();
    } catch (error) {
      console.error('Error creating concept:', error);
      alert('Error al crear el concepto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-calcular monto por jugador si cambia el total
  const handleTotalChange = (value: string) => {
    handleChange('total_amount', value);
    const total = parseFloat(value);
    if (!isNaN(total) && total > 0) {
      // Asumiendo 15 jugadores por defecto, puedes ajustarlo
      const perPlayer = (total / 15).toFixed(2);
      handleChange('amount_per_player', perPlayer);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/finanzas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo Concepto de Pago</CardTitle>
          <CardDescription>
            Registra un nuevo concepto como mantenimiento de campo, uniformes, torneos, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Concepto *</Label>
              <Input
                id="name"
                placeholder="Ej: Mantenimiento Juego vs Toros"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción opcional del concepto"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="game">🏟️ Mantenimiento/Juego</SelectItem>
                  <SelectItem value="uniform">👕 Uniformes</SelectItem>
                  <SelectItem value="equipment">⚾ Equipo</SelectItem>
                  <SelectItem value="tournament">🏆 Torneo</SelectItem>
                  <SelectItem value="other">📋 Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Monto Total */}
            <div className="space-y-2">
              <Label htmlFor="total_amount">Monto Total *</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                placeholder="900.00"
                value={formData.total_amount}
                onChange={(e) => handleTotalChange(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Monto total a recaudar entre todos los jugadores
              </p>
            </div>

            {/* Monto por Jugador */}
            <div className="space-y-2">
              <Label htmlFor="amount_per_player">Monto por Jugador *</Label>
              <Input
                id="amount_per_player"
                type="number"
                step="0.01"
                placeholder="60.00"
                value={formData.amount_per_player}
                onChange={(e) => handleChange('amount_per_player', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Cuánto debe aportar cada jugador
              </p>
            </div>

            {/* Fecha Límite */}
            <div className="space-y-2">
              <Label htmlFor="due_date">Fecha Límite (opcional)</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange('due_date', e.target.value)}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creando...' : 'Crear Concepto'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}