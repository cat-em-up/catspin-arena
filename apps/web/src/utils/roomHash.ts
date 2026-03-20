function buildUrlWithoutHash(): string {
  return `${window.location.pathname}${window.location.search}`;
}

export function getRoomIdFromHash(): string | null {
  const rawHash = window.location.hash;

  if (rawHash.length <= 1) {
    return null;
  }

  const value = rawHash.slice(1).trim();

  if (value.length === 0) {
    return null;
  }

  return decodeURIComponent(value);
}

export function setRoomIdHash(roomId: string): void {
  const trimmedRoomId = roomId.trim();

  if (trimmedRoomId.length === 0) {
    clearRoomIdHash();
    return;
  }

  const nextUrl = `${buildUrlWithoutHash()}#${encodeURIComponent(trimmedRoomId)}`;
  window.history.replaceState(null, "", nextUrl);
}

export function clearRoomIdHash(): void {
  const nextUrl = buildUrlWithoutHash();
  window.history.replaceState(null, "", nextUrl);
}
