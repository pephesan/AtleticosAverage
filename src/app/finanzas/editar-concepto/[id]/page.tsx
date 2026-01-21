// src/app/finanzas/editar-concepto/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPaymentConceptById, updatePaymentConcept } from '@/lib/supabase-queries';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditarConceptoPage() {
  const router = useRouter();
  const params = useParams();
  const conceptId = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    total_amount: '',
    amount_per_player: '',
    type: 'game',
    due_date: '',
    status: 'active',
  });

  useEffect(() => {
    async function loadConcept() {
      const concept = await getPaymentConceptById(conceptId);
      if (concept) {
        setFormData({
          name: concept.name,
          description: concept.description || '',
          total_amount: concept.total_amount.toString(),
          amount_per_player: concept.amount_per_player.toString(),
          type: concept.type,
          due_date: concept.due_date || '',
          status: concept.status,
        });
      }
      setLoading(false);
    }
    loadConcept();
  }, [conceptId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePaymentConcept(conceptId, {
        name: formData.name,
        description: formData.description || undefined,
        total_amount: parseFloat(formData.total_amount),
        amount_per_player: parseFloat(formData.amount_per_player),
        due_date: formData.due_date || undefined,
      });

      router.push('/finanzas');
      router.refresh();
    } catch (error) {
      console.error('Error updating concept:', error);
      alert('Error al actualizar el concepto');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="container mx-auto p-6">Cargando...</div>;
  }

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
          <CardTitle>Editar Concepto</CardTitle>
          <CardDescription>
            Modifica los datos del concepto de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Concepto *</Label>
              <Input
                id="name"
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
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            {/* Monto Total */}
            <div className="space-y-2">
              <Label htmlFor="total_amount">Monto Total *</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => handleChange('total_amount', e.target.value)}
                required
              />
            </div>

            {/* Monto por Jugador */}
            <div className="space-y-2">
              <Label htmlFor="amount_per_player">Monto por Jugador *</Label>
              <Input
                id="amount_per_player"
                type="number"
                step="0.01"
                value={formData.amount_per_player}
                onChange={(e) => handleChange('amount_per_player', e.target.value)}
                required
              />
            </div>

            {/* Fecha Límite */}
            <div className="space-y-2">
              <Label htmlFor="due_date">Fecha Límite</Label>
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
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}