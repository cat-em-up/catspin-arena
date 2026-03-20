import type { RoomDTO } from "@catspin/protocol";
import { Section } from "../layout/Section";
import type { PlayerView } from "../../types/playerView";
import { SlotMachine } from "../slot/SlotMachine";
import { PlayerItem } from "../common/PlayerItem";

type GameScreenProps = {
  readonly room: RoomDTO;
  readonly playerId: string | null;
  readonly currentPlayer: PlayerView | null;
  readonly betInput: number;
  readonly onBetInputChange: (value: number) => void;
  readonly onSetBet: () => void;
  readonly onLeaveRoom: () => void;
};

function getFallbackGrid(): readonly (readonly (
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "M1"
  | "M2"
  | "H1"
  | "H2"
)[])[] {
  return [
    ["L1", "L2", "L3", "L4", "M1"],
    ["M1", "M2", "H1", "L2", "L3"],
    ["L4", "L1", "M2", "H2", "H1"],
  ];
}

function getPlayersWaitingForBet(room: RoomDTO): readonly PlayerView[] {
  return room.game.players.filter((player) => {
    if (player.isEliminated) {
      return false;
    }

    if (!player.isConnected) {
      return false;
    }

    return player.currentBet <= 0;
  });
}

export function GameScreen(props: GameScreenProps) {
  const {
    room,
    playerId,
    currentPlayer,
    betInput,
    onBetInputChange,
    onSetBet,
    onLeaveRoom,
  } = props;

  const round = room.game.round;
  const result = round.result;

  const isBetting = round.status === "betting";
  const isSpinning = round.status === "spinning";
  const isResolved = round.status === "resolved";

  const waitingPlayers = getPlayersWaitingForBet(room);

  const displayGrid = result?.grid ?? getFallbackGrid();
  const winningLines = result?.winningLines ?? [];
  const totalMultiplier = result?.totalMultiplier ?? 0;

  return (
    <>
      <Section title="Game">
        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          <div>
            <p>
              Room: <strong>{room.id}</strong>
            </p>

            <p>
              Game status: <strong>{room.game.status}</strong>
            </p>

            <p>
              Round: <strong>{round.index}</strong>
            </p>

            <p>
              Round status: <strong>{round.status}</strong>
            </p>

            <p>
              Your balance: <strong>{currentPlayer?.balance ?? "—"}</strong>
            </p>

            <p>
              Your current bet:{" "}
              <strong>{currentPlayer?.currentBet ?? "—"}</strong>
            </p>

            <p>
              Your last win: <strong>{currentPlayer?.lastWin ?? "—"}</strong>
            </p>
          </div>

          <div>
            <SlotMachine
              grid={displayGrid}
              isSpinning={isSpinning}
              winningLines={winningLines}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {isBetting ? (
              waitingPlayers.length > 0 ? (
                <p>
                  Waiting for bets from:{" "}
                  <strong>
                    {waitingPlayers.map((player) => player.name).join(", ")}
                  </strong>
                </p>
              ) : (
                <p>
                  <strong>All bets are placed. Waiting for spin...</strong>
                </p>
              )
            ) : null}

            {isSpinning ? (
              <p>
                <strong>Spinning...</strong>
              </p>
            ) : null}

            {isResolved ? (
              <>
                <p>
                  <strong>Total multiplier: x{totalMultiplier}</strong>
                </p>

                {winningLines.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {winningLines.map((line) => (
                      <li
                        key={`${line.lineIndex}-${line.symbol}-${line.count}`}
                      >
                        line {line.lineIndex}, symbol {line.symbol}, count{" "}
                        {line.count}, multiplier x{line.multiplier}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No winning lines</p>
                )}
              </>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="number"
              min={1}
              value={Number.isFinite(betInput) ? betInput : 10}
              onChange={(event) =>
                onBetInputChange(Number(event.target.value) || 0)
              }
              disabled={!isBetting}
            />

            <button
              type="button"
              onClick={onSetBet}
              disabled={currentPlayer === null || !isBetting || betInput <= 0}
            >
              Set Bet
            </button>

            <button type="button" onClick={onLeaveRoom}>
              Leave room
            </button>
          </div>
        </div>
      </Section>

      <Section title="Players">
        <ul style={{ paddingLeft: 20 }}>
          {room.game.players.map((player) => (
            <PlayerItem
              key={player.id}
              player={player}
              isCurrent={player.id === playerId}
              isHost={room.game.hostPlayerId === player.id}
            />
          ))}
        </ul>
      </Section>

      <Section title="Raw Room State">
        <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {JSON.stringify(room, null, 2)}
        </pre>
      </Section>
    </>
  );
}
