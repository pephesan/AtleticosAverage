// src/components/finance/RegistrarPagoForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addPayment, getPlayers, getPaymentConcepts } from '@/lib/supabase-queries';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function RegistrarPagoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conceptoId = searchParams.get('concepto');

  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    player_id: '',
    concept_id: conceptoId || '',
    amount_paid: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'efectivo',
    notes: '',
  });

  useEffect(() => {
    async function fetchData() {
      const [playersData, conceptsData] = await Promise.all([
        getPlayers(),
        getPaymentConcepts(),
      ]);
      setPlayers(playersData);
      setConcepts(conceptsData.filter((c) => c.status === 'active'));
    }
    fetchData();
  }, []);

  // Auto-llenar monto según concepto seleccionado
  useEffect(() => {
    if (formData.concept_id) {
      const concept = concepts.find((c) => c.id === parseInt(formData.concept_id));
      if (concept) {
        setFormData((prev) => ({
          ...prev,
          amount_paid: concept.amount_per_player.toString(),
        }));
      }
    }
  }, [formData.concept_id, concepts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addPayment({
        player_id: parseInt(formData.player_id),
        concept_id: parseInt(formData.concept_id),
        amount_paid: parseFloat(formData.amount_paid),
        payment_date: formData.payment_date,
        payment_method: formData.payment_method,
        notes: formData.notes || undefined,
      });

      router.push('/finanzas');
      router.refresh();
    } catch (error) {
      console.error('Error registering payment:', error);
      alert('Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <CardTitle>Registrar Pago</CardTitle>
          <CardDescription>
            Registra un pago realizado por un jugador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Jugador */}
            <div className="space-y-2">
              <Label htmlFor="player_id">Jugador *</Label>
              <Select value={formData.player_id} onValueChange={(value) => handleChange('player_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un jugador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      #{player.number} - {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Concepto */}
            <div className="space-y-2">
              <Label htmlFor="concept_id">Concepto *</Label>
              <Select value={formData.concept_id} onValueChange={(value) => handleChange('concept_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un concepto" />
                </SelectTrigger>
                <SelectContent>
                  {concepts.map((concept) => (
                    <SelectItem key={concept.id} value={concept.id.toString()}>
                      {concept.name} - ${concept.amount_per_player}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Monto */}
            <div className="space-y-2">
              <Label htmlFor="amount_paid">Monto Pagado *</Label>
              <Input
                id="amount_paid"
                type="number"
                step="0.01"
                placeholder="60.00"
                value={formData.amount_paid}
                onChange={(e) => handleChange('amount_paid', e.target.value)}
                required
              />
            </div>

            {/* Fecha de Pago */}
            <div className="space-y-2">
              <Label htmlFor="payment_date">Fecha de Pago *</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => handleChange('payment_date', e.target.value)}
                required
              />
            </div>

            {/* Método de Pago */}
            <div className="space-y-2">
              <Label htmlFor="payment_method">Método de Pago *</Label>
              <Select value={formData.payment_method} onValueChange={(value) => handleChange('payment_method', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">💵 Efectivo</SelectItem>
                  <SelectItem value="transferencia">🏦 Transferencia</SelectItem>
                  <SelectItem value="otro">📱 Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Notas adicionales sobre el pago"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Registrando...' : 'Registrar Pago'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}