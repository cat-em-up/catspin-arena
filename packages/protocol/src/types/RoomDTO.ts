import type { GameStateDTO } from './GameStateDTO';

export type RoomDTO = {
  readonly id: string;
  readonly game: GameStateDTO;
};
