import { useEffect, useMemo, useRef, useState } from "react";
import type { RoomDTO } from "@catspin/protocol";
import { useClientStore, useClientStoreState } from "./state/storeContext";
import {
  clearRoomIdHash,
  getRoomIdFromHash,
  setRoomIdHash,
} from "./utils/roomHash";

type PlayerView = {
  readonly id: string;
  readonly name: string;
  readonly balance: number;
  readonly currentBet: number;
  readonly isReady: boolean;
  readonly isConnected: boolean;
  readonly isEliminated: boolean;
  readonly lastWin: number;
};

function getPlayers(room: RoomDTO | null): readonly PlayerView[] {
  return room?.game.players ?? [];
}

function getCurrentPlayer(
  room: RoomDTO | null,
  playerId: string | null,
): PlayerView | null {
  if (room === null || playerId === null) {
    return null;
  }

  return room.game.players.find((player) => player.id === playerId) ?? null;
}

export default function App() {
  const store = useClientStore();
  const state = useClientStoreState();

  const [roomInput, setRoomInput] = useState<string>(
    () => getRoomIdFromHash() ?? "",
  );
  const [nameInput, setNameInput] = useState<string>(state.playerName ?? "");
  const [betInput, setBetInput] = useState<number>(10);

  const autoJoinAttemptedRef = useRef(false);

  const players = useMemo(() => getPlayers(state.room), [state.room]);

  const currentPlayer = useMemo(() => {
    return getCurrentPlayer(state.room, state.playerId);
  }, [state.room, state.playerId]);

  const isHost =
    state.room !== null &&
    state.playerId !== null &&
    state.room.game.hostPlayerId === state.playerId;

  const canCreate = nameInput.trim().length > 0;
  const canJoin = nameInput.trim().length > 0 && roomInput.trim().length > 0;

  useEffect(() => {
    const handleHashChange = (): void => {
      const roomIdFromHash = getRoomIdFromHash() ?? "";
      setRoomInput(roomIdFromHash);
      autoJoinAttemptedRef.current = false;
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    const roomIdFromHash = getRoomIdFromHash();
    const name = nameInput.trim();

    if (roomIdFromHash === null || roomIdFromHash.length === 0) {
      return;
    }

    if (name.length === 0) {
      return;
    }

    if (state.connectionStatus !== "connected") {
      return;
    }

    if (state.room !== null) {
      return;
    }

    if (autoJoinAttemptedRef.current) {
      return;
    }

    autoJoinAttemptedRef.current = true;

    store.setPlayerName(name);
    store.joinRoom({
      roomId: roomIdFromHash,
      name,
    });
  }, [nameInput, state.connectionStatus, state.room, store]);

  useEffect(() => {
    if (state.room !== null) {
      setRoomIdHash(state.room.id);
      setRoomInput(state.room.id);
    }
  }, [state.room]);

  const handleCreateRoom = async (): Promise<void> => {
    const name = nameInput.trim();

    if (name.length === 0) {
      return;
    }

    try {
      store.setPlayerName(name);

      const roomId = await store.createRoom();
      setRoomIdHash(roomId);
      setRoomInput(roomId);

      autoJoinAttemptedRef.current = true;

      store.joinRoom({
        roomId,
        name,
      });
    } catch (error) {
      console.error("Failed to create room", error);
    }
  };

  const handleJoinRoom = (): void => {
    const roomId = roomInput.trim();
    const name = nameInput.trim();

    if (roomId.length === 0 || name.length === 0) {
      return;
    }

    setRoomIdHash(roomId);
    autoJoinAttemptedRef.current = true;

    store.setPlayerName(name);
    store.joinRoom({
      roomId,
      name,
    });
  };

  const handleLeaveRoom = (): void => {
    store.leaveRoom();
    clearRoomIdHash();
    autoJoinAttemptedRef.current = false;
  };

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <h1>CatSpin Arena</h1>

      <p>
        Connection: <strong>{state.connectionStatus}</strong>
      </p>

      {state.playerId !== null ? (
        <p>
          Player ID: <strong>{state.playerId}</strong>
        </p>
      ) : null}

      {state.error !== null ? (
        <p style={{ color: "crimson" }}>{state.error}</p>
      ) : null}

      <section
        style={{
          marginBottom: 24,
          padding: 16,
          border: "1px solid #ccc",
          borderRadius: 12,
        }}
      >
        <h2>Room Setup</h2>

        <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
          <input
            value={nameInput}
            onChange={(event) => {
              setNameInput(event.target.value);
              autoJoinAttemptedRef.current = false;
            }}
            placeholder="Your name"
          />

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={roomInput}
              onChange={(event) => {
                setRoomInput(event.target.value);
                autoJoinAttemptedRef.current = false;
              }}
              placeholder="Room ID"
            />
            <button
              type="button"
              onClick={handleCreateRoom}
              disabled={!canCreate}
            >
              Create
            </button>
          </div>

          <button type="button" onClick={handleJoinRoom} disabled={!canJoin}>
            Join room
          </button>
        </div>
      </section>

      <section
        style={{
          marginBottom: 24,
          padding: 16,
          border: "1px solid #ccc",
          borderRadius: 12,
        }}
      >
        <h2>Lobby</h2>

        <p>
          Room: <strong>{state.room?.id ?? "—"}</strong>
        </p>

        <p>
          Game status: <strong>{state.room?.game.status ?? "—"}</strong>
        </p>

        <p>
          Round: <strong>{state.room?.game.round.index ?? "—"}</strong>
        </p>

        <p>
          Round status: <strong>{state.room?.game.round.status ?? "—"}</strong>
        </p>

        <div
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}
        >
          <button
            type="button"
            onClick={() => store.setReady(!(currentPlayer?.isReady ?? false))}
            disabled={state.room === null || currentPlayer === null}
          >
            {currentPlayer?.isReady ? "Unset ready" : "Set ready"}
          </button>

          <button
            type="button"
            onClick={() => store.startGame()}
            disabled={state.room === null || !isHost}
          >
            Start game
          </button>

          <button
            type="button"
            onClick={handleLeaveRoom}
            disabled={state.room === null}
          >
            Leave room
          </button>
        </div>
      </section>

      <section
        style={{
          marginBottom: 24,
          padding: 16,
          border: "1px solid #ccc",
          borderRadius: 12,
        }}
      >
        <h2>Players</h2>

        <ul style={{ paddingLeft: 20 }}>
          {players.map((player) => {
            const isCurrent = player.id === state.playerId;
            const isRoomHost = state.room?.game.hostPlayerId === player.id;

            return (
              <li key={player.id} style={{ marginBottom: 8 }}>
                <strong>{player.name}</strong>
                {isCurrent ? " (you)" : ""}
                {isRoomHost ? " 👑" : ""}
                {" | "}
                balance: {player.balance}
                {" | "}
                bet: {player.currentBet}
                {" | "}
                ready: {String(player.isReady)}
                {" | "}
                connected: {String(player.isConnected)}
                {" | "}
                eliminated: {String(player.isEliminated)}
                {" | "}
                last win: {player.lastWin}
              </li>
            );
          })}
        </ul>
      </section>

      <section
        style={{
          marginBottom: 24,
          padding: 16,
          border: "1px solid #ccc",
          borderRadius: 12,
        }}
      >
        <h2>Bet Control</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number"
            min={1}
            value={Number.isFinite(betInput) ? betInput : 10}
            onChange={(event) => setBetInput(Number(event.target.value) || 0)}
          />
          <button
            type="button"
            onClick={() => store.setBet(betInput)}
            disabled={state.room === null}
          >
            Set bet
          </button>
        </div>
      </section>

      <section
        style={{
          padding: 16,
          border: "1px solid #ccc",
          borderRadius: 12,
        }}
      >
        <h2>Raw Room State</h2>
        <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {JSON.stringify(state.room, null, 2)}
        </pre>
      </section>
    </div>
  );
}
