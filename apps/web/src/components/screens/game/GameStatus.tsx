import type { PlayerView } from '../../../types/playerView';
import type { WinningLineDTO } from '@catspin/protocol';

type GameStatusProps = {
  readonly isBetting: boolean;
  readonly isSpinning: boolean;
  readonly waitingPlayers: readonly PlayerView[];
  readonly roundIndex: number;
};

function getFooterText(params: GameStatusProps): string {
  const { isBetting, isSpinning, waitingPlayers, roundIndex } = params;

  if (isBetting) {
    if (waitingPlayers.length > 0) {
      return `Waiting for bets from: ${waitingPlayers.map((player) => player.name).join(', ')}`;
    }

    return 'All bets are placed. Waiting for spin...';
  }

  if (isSpinning) {
    return `Spinning... (Round #${roundIndex})`;
  }

  return `Round #${roundIndex} in progress`;
}

export function GameStatus(props: GameStatusProps) {
  const text = getFooterText(props);

  return <div className="game-status muted">{text}</div>;
}
