import type { RoomDTO } from "@catspin/protocol";
import type { PlayerView } from "../../types/playerView";
import { Section } from "../layout/Section";
import { PlayerItem } from "../common/PlayerItem";

type LobbyScreenProps = {
  readonly room: RoomDTO;
  readonly playerId: string | null;
  readonly currentPlayer: PlayerView | null;
  readonly players: readonly PlayerView[];
  readonly isHost: boolean;
  readonly onToggleReady: () => void;
  readonly onStartGame: () => void;
  readonly onLeaveRoom: () => void;
};

export function LobbyScreen(props: LobbyScreenProps) {
  const {
    room,
    playerId,
    currentPlayer,
    players,
    isHost,
    onToggleReady,
    onStartGame,
    onLeaveRoom,
  } = props;

  return (
    <>
      <Section title="Lobby">
        <p>
          Room: <strong>{room.id}</strong>
        </p>

        <p>
          Game status: <strong>{room.game.status}</strong>
        </p>

        <p>
          Round: <strong>{room.game.round.index}</strong>
        </p>

        <p>
          Round status: <strong>{room.game.round.status}</strong>
        </p>

        <div
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}
        >
          <button
            type="button"
            onClick={onToggleReady}
            disabled={currentPlayer === null}
          >
            {currentPlayer?.isReady ? "Unset ready" : "Set ready"}
          </button>

          <button type="button" onClick={onStartGame} disabled={!isHost}>
            Start game
          </button>

          <button type="button" onClick={onLeaveRoom}>
            Leave room
          </button>
        </div>
      </Section>

      <Section title="Players">
        <ul style={{ paddingLeft: 20 }}>
          {players.map((player) => (
            <PlayerItem
              key={player.id}
              player={player}
              isCurrent={player.id === playerId}
              isHost={room.game.hostPlayerId === player.id}
            />
          ))}
        </ul>
      </Section>
    </>
  );
}
