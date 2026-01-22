// src/app/admin/page.tsx
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, BarChart3, Settings, TrendingUp, Clock } from 'lucide-react';

export default function AdminPage() {
  const adminSections = [
    {
      title: 'Gestión de Jugadores',
      description: 'Agregar, editar o eliminar jugadores del roster',
      icon: Users,
      href: '/admin/players',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Gestión de Juegos',
      description: 'Registrar resultados y programar nuevos juegos',
      icon: Calendar,
      href: '/admin/games',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Actualizar Estadísticas',
      description: 'Modificar estadísticas de jugadores',
      icon: BarChart3,
      href: '/admin/stats',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Panel Administrativo
            </h1>
          </div>
          <p className="text-muted-foreground text-lg ml-16">
            Gestiona jugadores, juegos y estadísticas del equipo
          </p>
        </div>

        {/* Warning Banner */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-yellow-500 text-white">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Panel de Administración</h3>
                <p className="text-sm text-muted-foreground">
                  Los cambios que realices aquí afectarán directamente la base de datos. Asegúrate de verificar la información antes de guardar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href} className="group">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-20 rounded-2xl blur-xl group-hover:blur-2xl transition-all`} />
                  <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all group-hover:scale-105 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
                        Administrar →
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <Users className="w-10 h-10 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Activos
                </Badge>
              </div>
              <CardTitle className="text-5xl font-black mt-4">5</CardTitle>
              <CardDescription className="text-blue-100 text-base font-medium">
                Total Jugadores
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <Calendar className="w-10 h-10 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Total
                </Badge>
              </div>
              <CardTitle className="text-5xl font-black mt-4">10</CardTitle>
              <CardDescription className="text-green-100 text-base font-medium">
                Juegos Registrados
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <Clock className="w-10 h-10 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Reciente
                </Badge>
              </div>
              <CardTitle className="text-4xl font-black mt-4">Hoy</CardTitle>
              <CardDescription className="text-orange-100 text-base font-medium">
                Última Actualización
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Consejos y Mejores Prácticas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h4 className="font-bold mb-1">Estadísticas</h4>
                    <p className="text-sm text-muted-foreground">
                      Actualiza las estadísticas después de cada juego para mantener los datos al día
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-green-500/10 dark:bg-green-500/20 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👕</span>
                  <div>
                    <h4 className="font-bold mb-1">Números</h4>
                    <p className="text-sm text-muted-foreground">
                      Verifica que los números de jersey no se repitan al agregar nuevos jugadores
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💾</span>
                  <div>
                    <h4 className="font-bold mb-1">Guardado</h4>
                    <p className="text-sm text-muted-foreground">
                      Los cambios se guardan automáticamente en la base de datos de Supabase
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}