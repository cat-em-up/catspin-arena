import type { Payline, Paytable } from "../game/Rules";
import type { SpinGrid, WinningLine } from "../game/Round";

export type PayoutResult = {
  readonly totalMultiplier: number;
  readonly winningLines: readonly WinningLine[];
};

export class PayoutCalculator {
  private readonly paylines: readonly Payline[];
  private readonly paytable: Paytable;

  public constructor(args: {
    paylines: readonly Payline[];
    paytable: Paytable;
  }) {
    this.paylines = args.paylines;
    this.paytable = args.paytable;
  }

  public evaluate(grid: SpinGrid): PayoutResult {
    const winningLines: WinningLine[] = [];
    let totalMultiplier = 0;

    this.paylines.forEach((line, lineIndex) => {
      const firstSymbol = grid[0]?.[line[0]];

      if (firstSymbol === undefined) {
        return;
      }

      let count = 1;

      for (let reelIndex = 1; reelIndex < line.length; reelIndex += 1) {
        const rowIndex = line[reelIndex];
        const symbol = grid[reelIndex]?.[rowIndex];

        if (symbol !== firstSymbol) {
          break;
        }

        count += 1;
      }

      if (count < 3) {
        return;
      }

      const multiplier = this.paytable[firstSymbol][count as 3 | 4 | 5] ?? 0;

      if (multiplier <= 0) {
        return;
      }

      totalMultiplier += multiplier;

      winningLines.push({
        lineIndex,
        symbol: firstSymbol,
        count,
        multiplier,
      });
    });

    return {
      totalMultiplier,
      winningLines,
    };
  }
}
