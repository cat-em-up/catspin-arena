import Fastify from "fastify";
import cors from "@fastify/cors";

import { RoomManager } from "./rooms/RoomManager";
import { attachWebSocketServer } from "./ws/server";
import { registerCreateRoomRoute } from "./http/createRoom";

async function bootstrap(): Promise<void> {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });

  const roomManager = new RoomManager();

  registerCreateRoomRoute(app, roomManager);
  attachWebSocketServer(app, roomManager);

  await app.listen({
    port: 3000,
    host: "0.0.0.0",
  });

  app.log.info("HTTP server started on http://localhost:3000");
  app.log.info("WebSocket server attached on ws://localhost:3000/ws");
}

void bootstrap();
