// src/types/index.ts

export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  image?: string;
}

export interface PlayerStats {
  playerId: number;
  gamesPlayed: number;
  atBats: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  walks: number;
  strikeouts: number;
  stolenBases: number;
  battingAverage: number;
  onBasePercentage: number;
  sluggingPercentage: number;
}

export interface Game {
  id: number;
  date: string;
  opponent: string;
  location: 'home' | 'away';
  scoreUs: number;
  scoreThem: number;
  result: 'W' | 'L' | 'T';
}

export interface TeamStats {
  wins: number;
  losses: number;
  ties: number;
  totalRuns: number;
  totalHits: number;
  teamBattingAverage: number;
}