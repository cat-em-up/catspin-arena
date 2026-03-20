export type GameStatus = "lobby" | "running" | "finished";

export type RoundStatus = "idle" | "betting" | "spinning" | "resolved";

export type SymbolId = "L1" | "L2" | "L3" | "L4" | "M1" | "M2" | "H1" | "H2";

export type Payline = readonly number[];

export type Paytable = Readonly<
  Record<SymbolId, Partial<Record<3 | 4 | 5, number>>>
>;

export type GameConfig = {
  readonly startBalance: number;
  readonly minBet: number;
  readonly maxBet: number;
  readonly targetBalance: number;
  readonly bettingDurationMs: number;
  readonly spinDurationMs: number;
  readonly rows: number;
  readonly reels: number;
  readonly reelStrips: readonly (readonly SymbolId[])[];
  readonly paylines: readonly Payline[];
  readonly paytable: Paytable;
};

export const DEFAULT_REEL_STRIPS: readonly (readonly SymbolId[])[] = [
  ["L1", "L2", "L3", "L4", "M1", "L1", "L2", "H1", "L3", "M2", "L4", "H2"],
  ["L2", "L3", "L4", "L1", "M1", "L2", "H1", "L3", "M2", "L4", "L1", "H2"],
  ["L3", "L4", "L1", "L2", "M1", "L3", "H1", "L4", "M2", "L1", "L2", "H2"],
  ["L4", "L1", "L2", "L3", "M1", "L4", "H1", "L1", "M2", "L2", "L3", "H2"],
  ["L1", "L3", "L2", "L4", "M1", "L1", "H1", "L2", "M2", "L3", "L4", "H2"],
] as const;

export const DEFAULT_PAYLINES: readonly Payline[] = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
] as const;

export const DEFAULT_PAYTABLE: Paytable = {
  L1: { 3: 5, 4: 10, 5: 20 },
  L2: { 3: 5, 4: 10, 5: 20 },
  L3: { 3: 6, 4: 12, 5: 24 },
  L4: { 3: 6, 4: 12, 5: 24 },
  M1: { 3: 10, 4: 20, 5: 40 },
  M2: { 3: 12, 4: 24, 5: 50 },
  H1: { 3: 20, 4: 50, 5: 100 },
  H2: { 3: 25, 4: 60, 5: 150 },
};

export const DEFAULT_GAME_CONFIG: GameConfig = {
  startBalance: 1_000,
  minBet: 10,
  maxBet: 100,
  targetBalance: 3_000,
  bettingDurationMs: 8_000,
  spinDurationMs: 2_000,
  rows: 3,
  reels: 5,
  reelStrips: DEFAULT_REEL_STRIPS,
  paylines: DEFAULT_PAYLINES,
  paytable: DEFAULT_PAYTABLE,
};
