import type { PublicGameState } from "@catspin/core";
import type { GameStateDTO, RoomDTO } from "@catspin/protocol";

export function toGameStateDto(game: PublicGameState): GameStateDTO {
  return {
    id: game.id,
    status: game.status,
    hostPlayerId: game.hostPlayerId,
    winnerPlayerId: game.winnerPlayerId,
    players: game.players.map((player) => ({
      id: player.id,
      name: player.name,
      balance: player.balance,
      currentBet: player.currentBet,
      isReady: player.isReady,
      isConnected: player.isConnected,
      isEliminated: player.isEliminated,
      lastWin: player.lastWin,
    })),
    round: {
      index: game.round.index,
      status: game.round.status,
      startedAt: game.round.startedAt,
      bettingClosesAt: game.round.bettingClosesAt,
      spinAt: game.round.spinAt,
      result:
        game.round.result === null
          ? null
          : {
              grid: game.round.result.grid.map((column) => [...column]),
              totalMultiplier: game.round.result.totalMultiplier,
              winningLines: game.round.result.winningLines.map((line) => ({
                lineIndex: line.lineIndex,
                symbol: line.symbol,
                count: line.count,
                multiplier: line.multiplier,
              })),
            },
    },
  };
}

export function toRoomDto(args: {
  id: string;
  game: PublicGameState;
}): RoomDTO {
  return {
    id: args.id,
    game: toGameStateDto(args.game),
  };
}
