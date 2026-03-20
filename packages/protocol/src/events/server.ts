import { z } from "zod";

import { roomSchema } from "../schemas";

export const roomStateEventSchema = z.object({
  type: z.literal("room_state"),
  room: roomSchema,
});

export const joinedRoomEventSchema = z.object({
  type: z.literal("joined_room"),
  room: roomSchema,
  playerId: z.string().min(1),
});

export const leftRoomEventSchema = z.object({
  type: z.literal("left_room"),
});

export const errorEventSchema = z.object({
  type: z.literal("error"),
  message: z.string().min(1),
});

export const serverEventSchema = z.discriminatedUnion("type", [
  roomStateEventSchema,
  joinedRoomEventSchema,
  leftRoomEventSchema,
  errorEventSchema,
]);

export type RoomStateEvent = z.infer<typeof roomStateEventSchema>;
export type JoinedRoomEvent = z.infer<typeof joinedRoomEventSchema>;
export type LeftRoomEvent = z.infer<typeof leftRoomEventSchema>;
export type ErrorEvent = z.infer<typeof errorEventSchema>;

export type ServerEvent = z.infer<typeof serverEventSchema>;
