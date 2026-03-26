import type { RoomDTO } from '../types/RoomDTO';

export type RoomStateEvent = {
  type: 'room_state';
  room: RoomDTO;
};

export type JoinedRoomEvent = {
  type: 'joined_room';
  room: RoomDTO;
  playerId: string;
};

export type LeftRoomEvent = {
  type: 'left_room';
};

export type ErrorEvent = {
  type: 'error';
  message: string;
};

export type ServerEvent = RoomStateEvent | JoinedRoomEvent | LeftRoomEvent | ErrorEvent;
