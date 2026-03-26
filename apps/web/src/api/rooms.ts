export type CreateRoomResponse = {
  roomId: string;
};

export async function createRoom(): Promise<CreateRoomResponse> {
  const response = await fetch('/rooms', {
    method: 'POST',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create room: ${response.status} ${text}`);
  }

  return (await response.json()) as CreateRoomResponse;
}
