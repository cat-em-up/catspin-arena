const PLAYER_NAME_KEY = "catspin.playerName";

export function getStoredPlayerName(): string {
  const value = window.localStorage.getItem(PLAYER_NAME_KEY);

  if (value === null) {
    return "";
  }

  return value;
}

export function savePlayerName(value: string): void {
  const normalized = value.trim();

  if (normalized.length === 0) {
    window.localStorage.removeItem(PLAYER_NAME_KEY);
    return;
  }

  window.localStorage.setItem(PLAYER_NAME_KEY, normalized);
}
