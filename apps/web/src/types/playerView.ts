export type PlayerView = {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
  readonly balance: number;
  readonly currentBet: number;
  readonly isReady: boolean;
  readonly isConnected: boolean;
  readonly isEliminated: boolean;
  readonly lastWin: number;
};
