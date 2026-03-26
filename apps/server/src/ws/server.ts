import type { FastifyInstance } from 'fastify';
import { WebSocketServer, type WebSocket } from 'ws';

import type { RoomManager } from '../rooms/RoomManager';
import { registerSocketHandlers } from './handlers';

export function attachWebSocketServer(app: FastifyInstance, roomManager: RoomManager): WebSocketServer {
  const server = app.server;

  const wss = new WebSocketServer({
    server,
    path: '/ws',
  });

  wss.on('connection', (socket: WebSocket) => {
    registerSocketHandlers(socket, roomManager);
  });

  return wss;
}
