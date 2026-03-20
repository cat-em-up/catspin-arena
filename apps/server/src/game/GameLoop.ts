import { RoomManager } from "../rooms/RoomManager";

export class GameLoop {
  private readonly roomManager: RoomManager;
  private readonly intervalMs: number;
  private timer: NodeJS.Timeout | null;

  public constructor(args: { roomManager: RoomManager; intervalMs?: number }) {
    this.roomManager = args.roomManager;
    this.intervalMs = args.intervalMs ?? 100;
    this.timer = null;
  }

  public start(): void {
    if (this.timer !== null) {
      return;
    }

    this.timer = setInterval(() => {
      const now = Date.now();
      this.roomManager.tickAll(now);
    }, this.intervalMs);
  }

  public stop(): void {
    if (this.timer === null) {
      return;
    }

    clearInterval(this.timer);
    this.timer = null;
  }

  public isRunning(): boolean {
    return this.timer !== null;
  }
}
