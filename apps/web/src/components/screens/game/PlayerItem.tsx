import type { PlayerView } from '../../../types/playerView';

type PlayerItemProps = {
  readonly player: PlayerView;
  readonly isCurrent: boolean;
  readonly isHost: boolean;
};

export function PlayerItem({ player, isCurrent, isHost }: PlayerItemProps) {
  return (
    <li
      className="player-card"
      data-current={isCurrent}
      data-online={player.isConnected}
      data-eliminated={player.isEliminated}
    >
      <div className="player-top">
        <div className="player-tags">
          <span className="player-name">{player.name}</span>
          {isCurrent ? <span className="badge">you</span> : null}
          {isHost ? <span className="badge">host</span> : null}
          {player.isEliminated ? <span className="badge is-danger">out</span> : null}
        </div>

        <span
          className="status-dot"
          data-state={player.isConnected ? 'connected' : 'disconnected'}
          aria-label={player.isConnected ? 'online' : 'offline'}
          title={player.isConnected ? 'online' : 'offline'}
        />
      </div>

      <div className="player-values">
        <span>Bal {player.balance}</span>
        <span>Bet {player.currentBet}</span>
        <span>Win {player.lastWin}</span>
      </div>
    </li>
  );
}
