export class RNG {
  private state: number;

  public constructor(seed: number) {
    const normalized = seed >>> 0;
    this.state = normalized === 0 ? 0x9e3779b9 : normalized;
  }

  public nextFloat(): number {
    let x = this.state;

    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;

    this.state = x >>> 0;

    return this.state / 0xffffffff;
  }

  public nextInt(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error('maxExclusive must be a positive integer');
    }

    return Math.floor(this.nextFloat() * maxExclusive);
  }

  public getState(): number {
    return this.state >>> 0;
  }
}
