import { RNG } from "./RNG";
import type { GameConfig, SymbolId } from "../game/Rules";
import type { SpinGrid } from "../game/Round";

export class SlotEngine {
  private readonly rows: number;
  private readonly reelStrips: readonly (readonly SymbolId[])[];

  public constructor(config: Pick<GameConfig, "rows" | "reelStrips">) {
    this.rows = config.rows;
    this.reelStrips = config.reelStrips;
  }

  public spin(rng: RNG): SpinGrid {
    return this.reelStrips.map((strip) => {
      if (strip.length === 0) {
        throw new Error("Reel strip must not be empty");
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
