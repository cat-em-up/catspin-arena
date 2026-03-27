export type PlayerSessionSnapshot = {
  readonly sessionId: string;
  readonly playerId: string;
  readonly roomId: string;
  readonly name: string;
  readonly avatar: string;
  readonly connected: boolean;
};

export class PlayerSession {
  public readonly sessionId: string;
  public readonly playerId: string;
  public readonly roomId: string;
  public readonly name: string;
  public readonly avatar: string;

  private connected: boolean;

  public constructor(args: { sessionId: string; playerId: string; roomId: string; name: string; avatar: string }) {
    this.sessionId = args.sessionId;
    this.playerId = args.playerId;
    this.roomId = args.roomId;
    this.name = args.name;
    this.avatar = args.avatar;
    this.connected = true;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public markConnected(): void {
    this.connected = true;
  }

  public markDisconnected(): void {
    this.connected = false;
  }

  public getSnapshot(): PlayerSessionSnapshot {
    return {
      sessionId: this.sessionId,
      playerId: this.playerId,
      roomId: this.roomId,
      name: this.name,
      avatar: this.avatar,
      connected: this.connected,
    };
  }
}
