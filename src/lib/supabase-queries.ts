// src/lib/supabase-queries.ts
import { supabase } from './supabase';

// Obtener todos los jugadores
export async function getPlayers() {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('number', { ascending: true });
  
  if (error) {
    console.error('Error fetching players:', error);
    return [];
  }
  return data || [];
}

// Obtener un jugador por ID
export async function getPlayerById(id: number) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching player:', error);
    return null;
  }
  return data;
}

// Obtener todas las estadísticas de jugadores
export async function getPlayerStats() {
  const { data, error } = await supabase
    .from('player_stats')
    .select('*');
  
  if (error) {
    console.error('Error fetching player stats:', error);
    return [];
  }
  return data || [];
}

// Obtener estadísticas de un jugador específico
export async function getPlayerStatsById(playerId: number) {
  const { data, error } = await supabase
    .from('player_stats')
    .select('*')
    .eq('player_id', playerId)
    .single();
  
  if (error) {
    console.error('Error fetching player stats:', error);
    return null;
  }
  return data;
}

// Obtener todos los juegos
export async function getGames() {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching games:', error);
    return [];
  }
  return data || [];
}

// Obtener estadísticas del equipo
export async function getTeamStats() {
  const { data, error } = await supabase
    .from('team_stats')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching team stats:', error);
    return null;
  }
  return data;
}