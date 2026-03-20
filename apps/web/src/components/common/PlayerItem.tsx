import type { PlayerView } from "../../types/playerView";

type PlayerItemProps = {
  readonly player: PlayerView;
  readonly isCurrent: boolean;
  readonly isHost: boolean;
};

export function PlayerItem(props: PlayerItemProps) {
  const { player, isCurrent, isHost } = props;

  return (
    <li
      className={`player-item ${
        player.isConnected ? "player-online" : "player-offline"
      }`}
    >
      <strong>{player.name}</strong>
      {isCurrent ? " (you)" : ""}
      {isHost ? " 👑" : ""}
      {" | "}
      <span className="player-status">
        <span className="player-status-dot" />
        {player.isConnected ? "online" : "offline"}
      </span>
      {" | "}
      balance: {player.balance}
      {" | "}
      bet: {player.currentBet}
      {" | "}
      eliminated: {String(player.isEliminated)}
      {" | "}
      last win: {player.lastWin}
    </li>
  );
}
