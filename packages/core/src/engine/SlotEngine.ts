import type { SlotMathConfig } from '../config/MathConfig';
import type { GameSettings, SymbolId } from '../game/Rules';
import type { SpinGrid } from '../game/Round';
import { RNG } from './RNG';

export class SlotEngine {
  private readonly rows: number;
  private readonly reelStrips: readonly (readonly SymbolId[])[];

  public constructor(config: {
    readonly rows: GameSettings['rows'];
    readonly math: Pick<SlotMathConfig, 'reelStrips'>;
  }) {
    this.rows = config.rows;
    this.reelStrips = config.math.reelStrips;
  }

  public spin(rng: RNG): SpinGrid {
    return this.reelStrips.map((strip) => {
      if (strip.length === 0) {
        throw new Error('Reel strip must not be empty');
      }

      const startIndex = rng.nextInt(strip.length);
      const column: SymbolId[] = [];

      for (let row = 0; row < this.rows; row += 1) {
        column.push(strip[(startIndex + row) % strip.length]);
      }

      return column;
    });
  }
}
