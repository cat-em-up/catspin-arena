import { useEffect, useMemo, useRef, useState } from "react";
import type { RoomDTO } from "@catspin/protocol";
import { useClientStore, useClientStoreState } from "./state/storeContext";
import {
  clearRoomIdHash,
  getRoomIdFromHash,
  setRoomIdHash,
} from "./utils/roomHash";
import type { PlayerView } from "./types/playerView";
import { NameScreen } from "./components/screens/NameScreen";
import { RoomSetupScreen } from "./components/screens/RoomSetupScreen";
import { LobbyScreen } from "./components/screens/LobbyScreen";
import { GameScreen } from "./components/screens/GameScreen";

type Screen = "name" | "room_setup" | "lobby" | "game";

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

function getScreen(playerName: string | null, room: RoomDTO | null): Screen {
  if (playerName === null || playerName.trim().length === 0) {
    return "name";
  }

  if (room === null) {
    return "room_setup";
  }

  if (room.game.status === "lobby") {
    return "lobby";
  }

  return "game";
}

export default function App() {
  const store = useClientStore();
  const state = useClientStoreState();

  const [roomInput, setRoomInput] = useState<string>(
    () => getRoomIdFromHash() ?? "",
  );
  const [betInput, setBetInput] = useState<number>(10);

  const autoJoinAttemptedRef = useRef(false);

  const players = useMemo(() => getPlayers(state.room), [state.room]);

  const currentPlayer = useMemo(() => {
    return getCurrentPlayer(state.room, state.playerId);
  }, [state.room, state.playerId]);

  const screen = useMemo(() => {
    return getScreen(state.playerName, state.room);
  }, [state.playerName, state.room]);

  const isHost =
    state.room !== null &&
    state.playerId !== null &&
    state.room.game.hostPlayerId === state.playerId;

  const trimmedPlayerName = state.playerName?.trim() ?? "";
  const canCreate = trimmedPlayerName.length > 0;
  const canJoin = trimmedPlayerName.length > 0 && roomInput.trim().length > 0;

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
    const name = state.playerName?.trim() ?? "";

    if (!roomIdFromHash) {
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

    store.joinRoom({
      roomId: roomIdFromHash,
      name,
    });
  }, [state.connectionStatus, state.playerName, state.room, store]);

  useEffect(() => {
    if (state.room !== null) {
      setRoomIdHash(state.room.id);
      setRoomInput(state.room.id);
    }
  }, [state.room]);

  const handleSetPlayerName = (name: string): void => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return;
    }

    store.setPlayerName(trimmedName);
    autoJoinAttemptedRef.current = false;
  };

  const handleChangeName = (): void => {
    store.setPlayerName("");
    autoJoinAttemptedRef.current = false;
  };

  const handleCreateRoom = async (): Promise<void> => {
    const name = state.playerName?.trim() ?? "";

    if (name.length === 0) {
      return;
    }

    try {
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
    const name = state.playerName?.trim() ?? "";

    if (roomId.length === 0 || name.length === 0) {
      return;
    }

    setRoomIdHash(roomId);
    autoJoinAttemptedRef.current = true;

    store.joinRoom({
      roomId,
      name,
    });
  };

  const handleLeaveRoom = (): void => {
    autoJoinAttemptedRef.current = true;
    clearRoomIdHash();
    setRoomInput("");
    store.leaveRoom();
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

      {screen === "name" ? (
        <NameScreen
          initialValue={state.playerName ?? ""}
          onSubmit={handleSetPlayerName}
        />
      ) : null}

      {screen === "room_setup" ? (
        <RoomSetupScreen
          playerName={trimmedPlayerName}
          roomInput={roomInput}
          onRoomInputChange={(value) => {
            setRoomInput(value);
            autoJoinAttemptedRef.current = false;
          }}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onChangeName={handleChangeName}
          canCreate={canCreate}
          canJoin={canJoin}
        />
      ) : null}

      {screen === "lobby" && state.room !== null ? (
        <LobbyScreen
          room={state.room}
          playerId={state.playerId}
          currentPlayer={currentPlayer}
          players={players}
          isHost={isHost}
          onToggleReady={() =>
            store.setReady(!(currentPlayer?.isReady ?? false))
          }
          onStartGame={() => store.startGame()}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : null}

      {screen === "game" && state.room !== null ? (
        <GameScreen
          room={state.room}
          playerId={state.playerId}
          currentPlayer={currentPlayer}
          betInput={betInput}
          onBetInputChange={setBetInput}
          onSetBet={() => store.setBet(betInput)}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : null}
    </div>
  );
}
