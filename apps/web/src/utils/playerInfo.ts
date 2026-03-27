const PLAYER_NAME_KEY = 'catspin.playerName';
const PLAYER_AVATAR_KEY = 'catspin.playerAvatar';

export function getStoredPlayerInfo() {
  return {
    name: window.localStorage.getItem(PLAYER_NAME_KEY) || '',
    avatar: window.localStorage.getItem(PLAYER_AVATAR_KEY) || '',
  };
}

export function savePlayerInfo(name: string, avatar: string): void {
  if (name.length === 0 && avatar.length === 0) {
    window.localStorage.removeItem(PLAYER_NAME_KEY);
    window.localStorage.removeItem(PLAYER_AVATAR_KEY);
    return;
  }

  window.localStorage.setItem(PLAYER_NAME_KEY, name);
  window.localStorage.setItem(PLAYER_AVATAR_KEY, avatar);
}
