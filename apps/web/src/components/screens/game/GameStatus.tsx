import type { PlayerView } from '../../../types/playerView';
import type { WinningLineDTO } from '@catspin/protocol';

type GameStatusProps = {
  readonly isBetting: boolean;
  readonly isSpinning: boolean;
  readonly waitingPlayers: readonly PlayerView[];
  readonly roundIndex: number;
};

export function GameStatus(props: GameStatusProps) {
  const text = props.isBetting ? 'Waiting for bets' : `Round #${props.roundIndex} in progress`;

  return <div className="game-status muted">{text}</div>;
}
