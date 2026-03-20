import { z } from "zod";

export const joinRoomEventSchema = z.object({
  type: z.literal("join_room"),
  roomId: z.string().min(1),
  sessionId: z.string().min(1),
  playerId: z.string().min(1),
  name: z.string().min(1),
});

export const leaveRoomEventSchema = z.object({
  type: z.literal("leave_room"),
});

export const setReadyEventSchema = z.object({
  type: z.literal("set_ready"),
  playerId: z.string().min(1),
  value: z.boolean(),
});

export const setBetEventSchema = z.object({
  type: z.literal("set_bet"),
  playerId: z.string().min(1),
  amount: z.number().finite(),
});

export const startGameEventSchema = z.object({
  type: z.literal("start_game"),
  playerId: z.string().min(1),
});

export const clientEventSchema = z.discriminatedUnion("type", [
  joinRoomEventSchema,
  leaveRoomEventSchema,
  setReadyEventSchema,
  setBetEventSchema,
  startGameEventSchema,
]);

export type JoinRoomEvent = z.infer<typeof joinRoomEventSchema>;
export type LeaveRoomEvent = z.infer<typeof leaveRoomEventSchema>;
export type SetReadyEvent = z.infer<typeof setReadyEventSchema>;
export type SetBetEvent = z.infer<typeof setBetEventSchema>;
export type StartGameEvent = z.infer<typeof startGameEventSchema>;

export type ClientEvent = z.infer<typeof clientEventSchema>;
