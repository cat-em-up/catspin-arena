import type { SymbolId } from "./Rules";

export type SpinGrid = readonly (readonly SymbolId[])[];

export type WinningLine = {
  readonly lineIndex: number;
  readonly symbol: SymbolId;
  readonly count: number;
  readonly multiplier: number;
};

export type SpinResult = {
  readonly grid: SpinGrid;
  readonly totalMultiplier: number;
  readonly winningLines: readonly WinningLine[];
};

export type RoundState = {
  readonly index: number;
  readonly status: "idle" | "betting" | "spinning" | "resolved";
  readonly startedAt: number | null;
  readonly bettingClosesAt: number | null;
  readonly spinAt: number | null;
  readonly seed: number;
  readonly result: SpinResult | null;
};

export function createRound(seed: number): RoundState {
  return {
    index: 0,
    status: "idle",
    startedAt: null,
    bettingClosesAt: null,
    spinAt: null,
    seed,
    result: null,
  };
}
