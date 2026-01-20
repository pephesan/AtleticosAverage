// src/scripts/migrate-data.ts
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Verificar que las variables existan
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  console.log('Asegúrate de que .env.local existe y contiene:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=...');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Datos mock a migrar
const mockPlayers = [
  { name: 'Juan Pérez', number: 10, position: 'CF' },
  { name: 'Carlos López', number: 5, position: 'SS' },
  { name: 'Miguel Sánchez', number: 23, position: '1B' },
  { name: 'Roberto García', number: 8, position: 'C' },
  { name: 'Luis Martínez', number: 15, position: 'LF' },
];

const mockPlayerStats = [
  { player_id: 1, games_played: 25, at_bats: 95, hits: 31, doubles: 6, triples: 2, home_runs: 4, rbi: 18, walks: 12, strikeouts: 22, stolen_bases: 8, batting_average: 0.326, on_base_percentage: 0.398, slugging_percentage: 0.526 },
  { player_id: 2, games_played: 25, at_bats: 88, hits: 26, doubles: 5, triples: 1, home_runs: 2, rbi: 15, walks: 10, strikeouts: 18, stolen_bases: 12, batting_average: 0.295, on_base_percentage: 0.367, slugging_percentage: 0.420 },
  { player_id: 3, games_played: 25, at_bats: 92, hits: 28, doubles: 8, triples: 0, home_runs: 6, rbi: 24, walks: 8, strikeouts: 25, stolen_bases: 1, batting_average: 0.304, on_base_percentage: 0.360, slugging_percentage: 0.543 },
  { player_id: 4, games_played: 23, at_bats: 78, hits: 22, doubles: 4, triples: 0, home_runs: 3, rbi: 16, walks: 9, strikeouts: 20, stolen_bases: 0, batting_average: 0.282, on_base_percentage: 0.352, slugging_percentage: 0.436 },
  { player_id: 5, games_played: 24, at_bats: 86, hits: 25, doubles: 7, triples: 3, home_runs: 1, rbi: 14, walks: 11, strikeouts: 19, stolen_bases: 6, batting_average: 0.291, on_base_percentage: 0.371, slugging_percentage: 0.453 },
];

const mockGames = [
  { date: '2026-01-05', opponent: 'Toros', location: 'home', score_us: 8, score_them: 5, result: 'W' },
  { date: '2026-01-08', opponent: 'Águilas', location: 'away', score_us: 3, score_them: 7, result: 'L' },
  { date: '2026-01-12', opponent: 'Leones', location: 'home', score_us: 6, score_them: 4, result: 'W' },
  { date: '2026-01-15', opponent: 'Tigres', location: 'away', score_us: 2, score_them: 9, result: 'L' },
  { date: '2026-01-18', opponent: 'Diablos', location: 'home', score_us: 10, score_them: 3, result: 'W' },
  { date: '2026-01-22', opponent: 'Sultanes', location: 'home', score_us: 5, score_them: 5, result: 'T' },
  { date: '2026-01-25', opponent: 'Toros', location: 'away', score_us: 7, score_them: 4, result: 'W' },
  { date: '2026-01-29', opponent: 'Charros', location: 'home', score_us: 4, score_them: 6, result: 'L' },
  { date: '2026-02-01', opponent: 'Leones', location: 'away', score_us: 9, score_them: 2, result: 'W' },
  { date: '2026-02-05', opponent: 'Águilas', location: 'home', score_us: 11, score_them: 8, result: 'W' },
];

async function migrateData() {
  console.log('🚀 Iniciando migración de datos...\n');

  try {
    // 1. Migrar jugadores
    console.log('📝 Insertando jugadores...');
    const { data: playersData, error: playersError } = await supabase
      .from('players')
      .insert(mockPlayers)
      .select();

    if (playersError) {
      console.error('❌ Error insertando jugadores:', playersError);
      return;
    }
    console.log(`✅ ${playersData.length} jugadores insertados`);

    // 2. Migrar estadísticas de jugadores
    console.log('\n📊 Insertando estadísticas de jugadores...');
    const { data: statsData, error: statsError } = await supabase
      .from('player_stats')
      .insert(mockPlayerStats)
      .select();

    if (statsError) {
      console.error('❌ Error insertando stats:', statsError);
      return;
    }
    console.log(`✅ ${statsData.length} registros de estadísticas insertados`);

    // 3. Migrar juegos
    console.log('\n⚾ Insertando juegos...');
    const { data: gamesData, error: gamesError } = await supabase
      .from('games')
      .insert(mockGames)
      .select();

    if (gamesError) {
      console.error('❌ Error insertando juegos:', gamesError);
      return;
    }
    console.log(`✅ ${gamesData.length} juegos insertados`);

    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   - Jugadores: ${playersData.length}`);
    console.log(`   - Estadísticas: ${statsData.length}`);
    console.log(`   - Juegos: ${gamesData.length}`);
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
}

migrateData();