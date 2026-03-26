import type { MathProfileId, SlotMathConfig } from '../config/MathConfig';

export type GameStatus = 'lobby' | 'running' | 'finished';

export type RoundStatus = 'idle' | 'betting' | 'spinning' | 'resolved';

export type SymbolId = 'L1' | 'L2' | 'L3' | 'L4' | 'M1' | 'M2' | 'H1' | 'H2';

export type Payline = readonly number[];

export type Paytable = Readonly<Record<SymbolId, Partial<Record<3 | 4 | 5, number>>>>;

export type MissedBetPolicy = 'repeat-last' | 'min-bet';
export type WinnerSelectionPolicy = 'highest-bet-only';
export type TiePayoutPolicy = 'split-evenly';
export type PayoutBasePolicy = 'highest-bet';

export type RoundRules = {
  readonly missedBetPolicy: MissedBetPolicy;
  readonly winnerSelectionPolicy: WinnerSelectionPolicy;
  readonly tiePayoutPolicy: TiePayoutPolicy;
  readonly payoutBasePolicy: PayoutBasePolicy;
};

export type GameSettings = {
  readonly startBalance: number;
  readonly minBet: number;
  readonly maxBet: number;
  readonly targetBalance: number;
  readonly bettingDurationMs: number;
  readonly spinDurationMs: number;
  readonly resolvedDurationMs: number;
  readonly rows: number;
  readonly reels: number;
};

export type GameConfig = GameSettings & {
  readonly roundRules: RoundRules;
  readonly mathProfileId: MathProfileId;
  readonly math: SlotMathConfig;
};
