import type { RoomDTO } from '@catspin/protocol';
import { createRoom as createRoomRequest } from '../api/rooms';
import { createRealtimeClient, type RealtimeClient } from '../network/client';
import type { SocketStatus } from '../network/socket';
import { getStoredPlayerInfo, savePlayerInfo } from '../utils/playerInfo';

export type FooterState = {
  primaryText: string;
  secondaryText?: string;
};

export type ClientStoreState = {
  connectionStatus: SocketStatus;
  roomId: string | null;
  playerId: string | null;
  playerName: string;
  playerAvatar: string;
  room: RoomDTO | null;
  error: string | null;
  footer: FooterState;
  serverTimeOffsetMs: number;
};

export type ClientStore = {
  getState: () => ClientStoreState;
  subscribe: (listener: () => void) => () => void;
  connect: () => void;
  disconnect: () => void;
  setPlayerInfo: (name: string, avatar: string) => void;
  createRoom: () => Promise<string>;
  joinRoom: (args: { roomId: string; name: string; avatar: string }) => void;
  leaveRoom: () => void;
  setReady: (ready: boolean) => void;
  setBet: (amount: number) => void;
  confirmBet: () => void;
  startGame: () => void;
  clearFooter: () => void;
};

export type CreateClientStoreOptions = {
  apiBaseUrl: string;
  wsUrl: string;
};

const EMPTY_FOOTER: FooterState = {
  primaryText: '',
  secondaryText: undefined,
};

export function createClientStore(options: CreateClientStoreOptions): ClientStore {
  const { name: playerName, avatar: playerAvatar } = getStoredPlayerInfo();

  let state: ClientStoreState = {
    connectionStatus: 'idle',
    roomId: null,
    playerId: null,
    playerName,
    playerAvatar,
    room: null,
    error: null,
    footer: EMPTY_FOOTER,
    serverTimeOffsetMs: 0,
  };

  const listeners = new Set<() => void>();

  const setState = (patch: Partial<ClientStoreState>): void => {
    state = {
      ...state,
      ...patch,
    };

    listeners.forEach((listener) => listener());
  };

  const client: RealtimeClient = createRealtimeClient({
    wsUrl: options.wsUrl,

    onRoomState: (room) => {
      setState({
        room,
        roomId: room.id,
        error: null,
        serverTimeOffsetMs: room.game.serverNow - Date.now(),
      });
    },

    onJoinedRoom: ({ room, playerId }) => {
      setState({
        room,
        roomId: room.id,
        playerId,
        error: null,
        serverTimeOffsetMs: room.game.serverNow - Date.now(),
      });
    },

    onLeftRoom: () => {
      setState({
        room: null,
        roomId: null,
        playerId: null,
        error: null,
        footer: EMPTY_FOOTER,
        serverTimeOffsetMs: 0,
      });
    },

    onError: (message) => {
      setState({
        error: message,
      });
    },

    onStatusChange: (connectionStatus) => {
      setState({ connectionStatus });
    },
  });

  return {
    getState: () => state,

    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    connect: () => {
      client.connect();
    },

    disconnect: () => {
      client.disconnect();
    },

    setPlayerInfo: (name: string, avatar: string) => {
      savePlayerInfo(name, avatar);

      setState({
        playerName: name.trim(),
        playerAvatar: avatar,
      });
    },

    createRoom: async () => {
      const result = await createRoomRequest();

      setState({
        roomId: result.roomId,
        error: null,
      });

      return result.roomId;
    },

    joinRoom: ({ roomId, name, avatar }) => {
      setState({
        roomId,
        playerName: name,
        playerAvatar: avatar,
        error: null,
      });

      client.joinRoom({ roomId, name, avatar });
    },

    leaveRoom: () => {
      setState({
        footer: EMPTY_FOOTER,
      });

      client.leaveRoom();
    },

    setReady: (ready) => {
      client.setReady(ready);
    },

    setBet: (amount) => {
      client.setBet(amount);
      client.confirmBet();
    },

    confirmBet: () => {
      client.confirmBet();
    },

    startGame: () => {
      client.startGame();
    },

    clearFooter: () => {
      setState({
        footer: EMPTY_FOOTER,
      });
    },
  };
}
