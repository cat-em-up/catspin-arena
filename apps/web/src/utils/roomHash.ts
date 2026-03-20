export function getRoomIdFromHash(): string | null {
  const raw = window.location.hash.replace(/^#/, "").trim();

  if (raw.length === 0) {
    return null;
  }

  return raw;
}

export function setRoomIdHash(roomId: string): void {
  const normalized = roomId.trim();

  if (normalized.length === 0) {
    clearRoomIdHash();
    return;
  }

  window.location.hash = normalized;
}

export function clearRoomIdHash(): void {
  const url = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", url);
}
