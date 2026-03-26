import crypto from 'node:crypto';
import type { FastifyInstance } from 'fastify';

import type { RoomManager } from '../rooms/RoomManager';

function createRoomId(): string {
  return crypto.randomBytes(6).toString('hex');
}

export function registerCreateRoomRoute(app: FastifyInstance, roomManager: RoomManager): void {
  app.post('/rooms', async () => {
    const roomId = createRoomId();
    const room = roomManager.getOrCreateRoom(roomId);

    return {
      roomId: room.id,
    };
  });
}
