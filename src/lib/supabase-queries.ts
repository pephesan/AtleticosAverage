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

export async function getGameById(id: number) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching game:', error);
    return null;
  }
  return data;
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
  console.log('=== DEBUG getPaymentConceptById ===');
  console.log('ID recibido:', id);
  console.log('Tipo de ID:', typeof id);
  
  const { data, error } = await supabase
    .from('payment_concepts')
    .select('*')
    .eq('id', id)
    .single();
  
  console.log('Data:', data);
  console.log('Error:', error);
  console.log('Error stringified:', JSON.stringify(error, null, 2));
  
  if (error) {
    console.error('Error fetching payment concept:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
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

// ==========================================
// SCORECARD QUERIES
// ==========================================

// Obtener lineup de un juego
export async function getGameLineup(gameId: number) {
  const { data, error } = await supabase
    .from('game_lineups')
    .select(`
      *,
      player:players(*)
    `)
    .eq('game_id', gameId)
    .order('batting_order', { ascending: true });

  if (error) {
    console.error('Error fetching game lineup:', error);
    return [];
  }
  return data;
}

// Crear lineup para un juego
export async function createGameLineup(lineup: { 
  game_id: number; 
  player_id: number; 
  batting_order: number; 
  position: string; 
}[]) {
  const { data, error } = await supabase
    .from('game_lineups')
    .insert(lineup)
    .select();

  if (error) {
    console.error('Error creating game lineup:', error);
    throw error;
  }
  return data;
}

// Obtener todos los turnos al bat de un juego
export async function getAtBats(gameId: number) {
  const { data, error } = await supabase
    .from('at_bats')
    .select(`
      *,
      player:players(*)
    `)
    .eq('game_id', gameId)
    .order('inning', { ascending: true })
    .order('batting_order', { ascending: true });

  if (error) {
    console.error('Error fetching at bats:', error);
    return [];
  }
  return data;
}

// Registrar un turno al bat
export async function addAtBat(atBat: {
  game_id: number;
  player_id: number;
  inning: number;
  batting_order: number;
  result_type: string;
  runs_scored?: number;
  rbis?: number;
  stolen_base?: boolean;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('at_bats')
    .insert(atBat)
    .select()
    .single();

  if (error) {
    console.error('Error adding at bat:', error);
    throw error;
  }
  return data;
}

// Eliminar un turno al bat
export async function deleteAtBat(id: number) {
  const { error } = await supabase
    .from('at_bats')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting at bat:', error);
    throw error;
  }
}

// Actualizar un turno al bat
export async function updateAtBat(id: number, updates: {
  result_type?: string;
  runs_scored?: number;
  rbis?: number;
  stolen_base?: boolean;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('at_bats')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating at bat:', error);
    throw error;
  }
  return data;
}

// Obtener sustituciones de un juego
export async function getSubstitutions(gameId: number) {
  const { data, error } = await supabase
    .from('player_substitutions')
    .select(`
      *,
      player_out:player_out_id(id, name, number),
      player_in:player_in_id(id, name, number)
    `)
    .eq('game_id', gameId)
    .order('inning', { ascending: true });

  if (error) {
    console.error('Error fetching substitutions:', error);
    return [];
  }
  return data;
}

// Registrar una sustitución
export async function addSubstitution(substitution: {
  game_id: number;
  inning: number;
  player_out_id: number;
  player_in_id: number;
  batting_order: number;
  position: string;
}) {
  const { data, error } = await supabase
    .from('player_substitutions')
    .insert(substitution)
    .select()
    .single();

  if (error) {
    console.error('Error adding substitution:', error);
    throw error;
  }
  return data;
}

// Eliminar una sustitución
export async function deleteSubstitution(id: number) {
  const { error } = await supabase
    .from('player_substitutions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting substitution:', error);
    throw error;
  }
}