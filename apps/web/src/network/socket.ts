import type { ClientEvent, ServerEvent } from '@catspin/protocol';

export type SocketStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

export type SocketClient = {
  connect: () => void;
  disconnect: () => void;
  send: (event: ClientEvent) => void;
  subscribe: (listener: (event: ServerEvent) => void) => () => void;
  onStatusChange: (listener: (status: SocketStatus) => void) => () => void;
  getStatus: () => SocketStatus;
};

export function createSocket(url: string): SocketClient {
  let socket: WebSocket | null = null;
  let status: SocketStatus = 'idle';

  const eventListeners = new Set<(event: ServerEvent) => void>();
  const statusListeners = new Set<(status: SocketStatus) => void>();

  const setStatus = (nextStatus: SocketStatus): void => {
    status = nextStatus;
    statusListeners.forEach((listener) => listener(status));
  };

  const connect = (): void => {
    if (socket !== null && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setStatus('connecting');

    socket = new WebSocket(url);

    socket.addEventListener('open', () => {
      setStatus('connected');
    });

    socket.addEventListener('close', () => {
      setStatus('disconnected');
      socket = null;
    });

    socket.addEventListener('error', () => {
      setStatus('disconnected');
    });

    socket.addEventListener('message', (message) => {
      try {
        const raw = JSON.parse(String(message.data)) as ServerEvent;
        eventListeners.forEach((listener) => listener(raw));
      } catch (error) {
        console.error('Failed to parse server event', error);
      }
    });
  };

  const disconnect = (): void => {
    if (socket === null) {
      setStatus('disconnected');
      return;
    }

    socket.close();
    socket = null;
    setStatus('disconnected');
  };

  const send = (event: ClientEvent): void => {
    if (socket === null || socket.readyState !== WebSocket.OPEN) {
      console.warn('Socket is not connected');
      return;
    }

    socket.send(JSON.stringify(event));
  };

  const subscribe = (listener: (event: ServerEvent) => void): (() => void) => {
    eventListeners.add(listener);

    return () => {
      eventListeners.delete(listener);
    };
  };

  const onStatusChange = (listener: (status: SocketStatus) => void): (() => void) => {
    statusListeners.add(listener);

    return () => {
      statusListeners.delete(listener);
    };
  };

  const getStatus = (): SocketStatus => status;

  return {
    connect,
    disconnect,
    send,
    subscribe,
    onStatusChange,
    getStatus,
  };
}
