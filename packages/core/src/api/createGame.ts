import { buildGameConfig, type GameConfigOverrides } from '../config/GameConfig';
import { createRound } from '../game/Round';
import type { GameId, GameState } from '../game/GameState';

export function createGame(args: { id: GameId; seed: number; config?: GameConfigOverrides }): GameState {
  const config = buildGameConfig(args.config);
  const normalizedSeed = args.seed >>> 0;

  return {
    id: args.id,
    status: 'lobby',
    hostPlayerId: null,
    players: [],
    round: createRound(normalizedSeed),
    config,
    rngState: normalizedSeed === 0 ? 0x9e3779b9 : normalizedSeed,
    winnerPlayerId: null,
    startedPlayerCount: 0,
  };
}
