import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { GameLoop } from './game/GameLoop';
import { RoomManager } from './rooms/RoomManager';
import { attachWebSocketServer } from './ws/server';
import { registerCreateRoomRoute } from './http/createRoom';

async function bootstrap(): Promise<void> {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const webDistPath = path.resolve(__dirname, '../../web/dist');

  await app.register(fastifyStatic, {
    root: webDistPath,
    prefix: '/',
  });

  const roomManager = new RoomManager();

  const gameLoop = new GameLoop({
    roomManager,
    intervalMs: 100,
  });

  registerCreateRoomRoute(app, roomManager);
  attachWebSocketServer(app, roomManager);

  gameLoop.start();

  let isShuttingDown = false;

  const shutdown = async (signal: 'SIGINT' | 'SIGTERM'): Promise<void> => {
    if (isShuttingDown === true) {
      return;
    }

    isShuttingDown = true;
    app.log.info({ signal }, 'Shutting down server');

    try {
      gameLoop.stop();
      await app.close();
      process.exit(0);
    } catch (error) {
      app.log.error({ error }, 'Failed to shut down cleanly');
      process.exit(1);
    }
  };

  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  const port = Number(process.env.PORT ?? 3000);

  await app.listen({
    port,
    host: '0.0.0.0',
  });

  app.log.info(`HTTP server started on port ${port}`);
  app.log.info('WebSocket server attached on /ws');
  app.log.info('Game loop started');
}

void bootstrap();
