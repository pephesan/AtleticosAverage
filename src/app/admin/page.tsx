// src/app/admin/page.tsx
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BarChart3, Settings } from 'lucide-react';

export default function AdminPage() {
  const adminSections = [
    {
      title: 'Gestión de Jugadores',
      description: 'Agregar, editar o eliminar jugadores del roster',
      icon: Users,
      href: '/admin/players',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Gestión de Juegos',
      description: 'Registrar resultados y programar nuevos juegos',
      icon: Calendar,
      href: '/admin/games',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Actualizar Estadísticas',
      description: 'Modificar estadísticas de jugadores',
      icon: BarChart3,
      href: '/admin/stats',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 py-8">
        <div className="flex items-center justify-center gap-3">
          <Settings className="w-12 h-12 text-blue-600" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Panel Administrativo
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Gestiona jugadores, juegos y estadísticas del equipo
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">Panel de Administración</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Los cambios que realices aquí afectarán directamente la base de datos. Asegúrate de verificar la información antes de guardar.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Administrar →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Jugadores</CardDescription>
            <CardTitle className="text-3xl">5</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Juegos Registrados</CardDescription>
            <CardTitle className="text-3xl">10</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Última Actualización</CardDescription>
            <CardTitle className="text-lg">Hoy</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💡</span> Consejos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Actualiza las estadísticas después de cada juego para mantener los datos al día</p>
          <p>• Verifica que los números de jersey no se repitan al agregar nuevos jugadores</p>
          <p>• Los cambios se guardan automáticamente en la base de datos de Supabase</p>
        </CardContent>
      </Card>
    </div>
  );
}