export type PlayerDTO = {
  readonly id: string;
  readonly name: string;
  readonly balance: number;
  readonly currentBet: number;
  readonly isReady: boolean;
  readonly isConnected: boolean;
  readonly isEliminated: boolean;
  readonly lastWin: number;
};
