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