// src/lib/supabase-queries.ts
import { supabase } from './supabase';

// ========== READ OPERATIONS ==========

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

export async function getTeamStats() {
  // Obtener todos los juegos
  const { data: games, error: gamesError } = await supabase
    .from('games')
    .select('*');
  
  if (gamesError) {
    console.error('Error fetching games:', gamesError);
    return null;
  }

  // Calcular récord dinámicamente
  const wins = games?.filter(g => g.result === 'W').length || 0;
  const losses = games?.filter(g => g.result === 'L').length || 0;
  const ties = games?.filter(g => g.result === 'T').length || 0;

  // Obtener stats de jugadores para calcular totales
  const { data: playerStats, error: statsError } = await supabase
    .from('player_stats')
    .select('*');
  
  if (statsError) {
    console.error('Error fetching player stats:', statsError);
  }

  const totalRuns = playerStats?.reduce((sum, p) => sum + (p.rbi || 0), 0) || 0;
  const totalHits = playerStats?.reduce((sum, p) => sum + (p.hits || 0), 0) || 0;
  const avgBatting = playerStats && playerStats.length > 0
    ? playerStats.reduce((sum, p) => sum + (p.batting_average || 0), 0) / playerStats.length
    : 0;

  return {
    wins,
    losses,
    ties,
    total_runs: totalRuns,
    total_hits: totalHits,
    team_batting_average: avgBatting
  };
}

// ========== CRUD OPERATIONS ==========

// ===== PLAYERS =====
export async function addPlayer(player: { name: string; number: number; position: string }) {
  const { data, error } = await supabase
    .from('players')
    .insert([player])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePlayer(id: number, player: { name: string; number: number; position: string }) {
  const { data, error } = await supabase
    .from('players')
    .update(player)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deletePlayer(id: number) {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ===== PLAYER STATS =====
export async function addPlayerStats(stats: {
  player_id: number;
  games_played: number;
  at_bats: number;
  hits: number;
  doubles: number;
  triples: number;
  home_runs: number;
  rbi: number;
  walks: number;
  strikeouts: number;
  stolen_bases: number;
  batting_average: number;
  on_base_percentage: number;
  slugging_percentage: number;
}) {
  const { data, error } = await supabase
    .from('player_stats')
    .insert([stats])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePlayerStats(
  playerId: number,
  stats: {
    games_played?: number;
    at_bats?: number;
    hits?: number;
    doubles?: number;
    triples?: number;
    home_runs?: number;
    rbi?: number;
    walks?: number;
    strikeouts?: number;
    stolen_bases?: number;
    batting_average?: number;
    on_base_percentage?: number;
    slugging_percentage?: number;
  }
) {
  const { data, error } = await supabase
    .from('player_stats')
    .update(stats)
    .eq('player_id', playerId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ===== GAMES =====
export async function addGame(game: {
  date: string;
  opponent: string;
  location: 'home' | 'away';
  score_us: number;
  score_them: number;
  result: 'W' | 'L' | 'T';
}) {
  const { data, error } = await supabase
    .from('games')
    .insert([game])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateGame(
  id: number,
  game: {
    date?: string;
    opponent?: string;
    location?: 'home' | 'away';
    score_us?: number;
    score_them?: number;
    result?: 'W' | 'L' | 'T';
  }
) {
  const { data, error } = await supabase
    .from('games')
    .update(game)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteGame(id: number) {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ========== FINANCE OPERATIONS ==========

// ===== PAYMENT CONCEPTS =====
export async function getPaymentConcepts() {
  const { data, error } = await supabase
    .from('payment_concepts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching payment concepts:', error);
    return [];
  }
  return data || [];
}

export async function getPaymentConceptById(id: number) {
  const { data, error } = await supabase
    .from('payment_concepts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching payment concept:', error);
    return null;
  }
  return data;
}

export async function addPaymentConcept(concept: {
  name: string;
  description?: string;
  total_amount: number;
  amount_per_player: number;
  type: string;
  due_date?: string;
}) {
  const { data, error } = await supabase
    .from('payment_concepts')
    .insert([concept])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePaymentConcept(
  id: number,
  concept: {
    name?: string;
    description?: string;
    total_amount?: number;
    amount_per_player?: number;
    status?: string;
    due_date?: string;
  }
) {
  const { data, error } = await supabase
    .from('payment_concepts')
    .update(concept)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deletePaymentConcept(id: number) {
  const { error } = await supabase
    .from('payment_concepts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ===== PAYMENTS =====
export async function getPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      players!inner(name)
    `)
    .order('payment_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
  return data || [];
}

export async function getPaymentsByConceptId(conceptId: number) {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      players!inner(name)
    `)
    .eq('concept_id', conceptId)
    .order('payment_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
  return data || [];
}

export async function getPaymentsByPlayerId(playerId: number) {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      payment_concepts!inner(name, amount_per_player)
    `)
    .eq('player_id', playerId)
    .order('payment_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
  return data || [];
}

export async function addPayment(payment: {
  player_id: number;
  concept_id: number;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deletePayment(id: number) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ===== FINANCE STATS =====
export async function getFinanceStats() {
  // Obtener todos los conceptos activos
  const { data: concepts } = await supabase
    .from('payment_concepts')
    .select('*')
    .eq('status', 'active');

  // Obtener todos los pagos
  const { data: payments } = await supabase
    .from('payments')
    .select('amount_paid');

  // Obtener total de jugadores
  const { data: players } = await supabase
    .from('players')
    .select('id');

  const totalExpected = concepts?.reduce((sum, c) => sum + (c.total_amount || 0), 0) || 0;
  const totalCollected = payments?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;
  const totalPlayers = players?.length || 0;

  return {
    totalExpected,
    totalCollected,
    totalPending: totalExpected - totalCollected,
    totalPlayers,
  };
}