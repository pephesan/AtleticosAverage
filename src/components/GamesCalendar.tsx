// src/components/GamesCalendar.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { GameDB } from '@/types';

export function GamesCalendar({ pastGames }: { pastGames: GameDB[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendario de Juegos</CardTitle>
          <CardDescription>Selecciona una fecha para ver juegos</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Game Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Ubicación</CardTitle>
          <CardDescription>Rendimiento local vs visitante</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Home Games */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">🏠 Juegos Locales</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {pastGames.filter(g => g.location === 'home' && g.result === 'W').length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">Victorias</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {pastGames.filter(g => g.location === 'home' && g.result === 'L').length}
                </p>
                <p className="text-xs text-red-600 dark:text-red-500">Derrotas</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {pastGames.filter(g => g.location === 'home' && g.result === 'T').length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Empates</p>
              </div>
            </div>
          </div>

          {/* Away Games */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">✈️ Juegos de Visitante</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {pastGames.filter(g => g.location === 'away' && g.result === 'W').length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">Victorias</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {pastGames.filter(g => g.location === 'away' && g.result === 'L').length}
                </p>
                <p className="text-xs text-red-600 dark:text-red-500">Derrotas</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {pastGames.filter(g => g.location === 'away' && g.result === 'T').length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Empates</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}