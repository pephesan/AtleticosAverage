// Tipos de Supabase (agregar al final del archivo)
export interface PlayerDB {
  id: number;
  name: string;
  number: number;
  position: string;
  image: string | null;
  created_at: string;
}

export interface PlayerStatsDB {
  id: number;
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
  updated_at: string;
}

export interface GameDB {
  id: number;
  date: string;
  opponent: string;
  location: 'home' | 'away';
  score_us: number;
  score_them: number;
  result: 'W' | 'L' | 'T' | null;
  created_at: string;
}

export interface TeamStatsDB {
  id: number;
  wins: number;
  losses: number;
  ties: number;
  total_runs: number;
  total_hits: number;
  team_batting_average: number;
  updated_at: string;
}

// ========== FINANCE TYPES ==========

export interface PaymentConceptDB {
  id: number;
  name: string;
  description: string | null;
  total_amount: number;
  amount_per_player: number;
  type: 'game' | 'uniform' | 'equipment' | 'tournament' | 'other';
  status: 'active' | 'completed' | 'cancelled';
  due_date: string | null;
  created_at: string;
}

export interface PaymentDB {
  id: number;
  player_id: number;
  concept_id: number;
  amount_paid: number;
  payment_date: string;
  payment_method: 'efectivo' | 'transferencia' | 'otro';
  notes: string | null;
  created_at: string;
}

// Para joins con información relacionada
export interface PaymentWithPlayer extends PaymentDB {
  player_name?: string;
}

export interface PaymentConceptWithStats extends PaymentConceptDB {
  total_paid: number;
  players_paid: number;
  total_players: number;
}