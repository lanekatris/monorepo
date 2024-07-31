import { RawUdiscScorecardEntry } from "./raw-udisc-scorecard-entry";

export interface Scorecard {
  courseName: string;
  layout: string;
  date: Date;
  players: string[];
  myScore: string;
}

export interface ScorecardResponse {
  scorecards: Scorecard[];
  stats: {
    aces: number;
    holes: number;
    throws: number;
    howLongHaveYouBeenPlaying: string;
    skippedScorecards: number;
    skippedScorecardNames: string[];
    rounds: {
      total: number;
      partial: number;
      full: number;
      best: {
        courseName: string;
        score: number;
      };
    };
    courses: {
      mostPlayed: {
        name: string;
        rounds: number;
      };
      // names: string[];
      played: number;
    };
  };
}

export interface ParseScorecardInput {
  playerName: string;
  excludes?: string[];
  rawScorecards: RawUdiscScorecardEntry[];
}
