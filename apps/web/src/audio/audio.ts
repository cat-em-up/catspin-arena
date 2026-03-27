import { sounds } from './sounds';

type SoundKey = keyof typeof sounds;

const cache = new Map<SoundKey, HTMLAudioElement>();

let unlocked = false;
let muted = false;
let masterVolume = 1;
let musicVolume = 1;
let sfxEnabled = true;
let musicEnabled = true;

const activeLoops = new Map<string, HTMLAudioElement>();
let activeMusic: HTMLAudioElement | null = null;
let activeMusicId: string | null = null;

let activePlaylist: string[] | null = null;
let activePlaylistIndex = 0;
let activeMusicToken = 0;

function clamp(value: number): number {
  if (Number.isFinite(value) === false) {
    return 1;
  }

  return Math.min(Math.max(value, 0), 1);
}

function isSoundKey(value: string): value is SoundKey {
  return value in sounds;
}

function shuffleStrings(values: readonly string[]): string[] {
  const result = [...values];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = result[index];

    if (current === undefined) {
      continue;
    }

    result[index] = result[randomIndex] ?? current;
    result[randomIndex] = current;
  }

  return result;
}

function applyBaseVolume(audio: HTMLAudioElement, id: SoundKey): void {
  const definition = sounds[id];
  audio.volume = clamp(definition.volume * masterVolume);
}

function applyMusicVolume(audio: HTMLAudioElement, id: SoundKey): void {
  const definition = sounds[id];
  audio.volume = clamp(definition.volume * masterVolume * musicVolume);
}

function clearActiveMusicHandlers(audio: HTMLAudioElement | null): void {
  if (!audio) {
    return;
  }

  audio.onended = null;
}

function playPlaylistTrack(token: number): void {
  if (!activePlaylist || activePlaylist.length === 0) {
    return;
  }

  if (!unlocked || muted || !musicEnabled) {
    return;
  }

  if (activePlaylistIndex >= activePlaylist.length) {
    activePlaylist = shuffleStrings(activePlaylist);
    activePlaylistIndex = 0;
  }

  const nextId = activePlaylist[activePlaylistIndex];
  if (!nextId || !isSoundKey(nextId)) {
    activePlaylistIndex += 1;
    playPlaylistTrack(token);
    return;
  }

  const base = cache.get(nextId);
  if (!base) {
    activePlaylistIndex += 1;
    playPlaylistTrack(token);
    return;
  }

  clearActiveMusicHandlers(activeMusic);

  if (activeMusic) {
    activeMusic.pause();
    activeMusic.currentTime = 0;
  }

  const audio = base.cloneNode(true) as HTMLAudioElement;
  audio.loop = false;
  audio.currentTime = 0;
  applyMusicVolume(audio, nextId);

  audio.onended = () => {
    if (token !== activeMusicToken) {
      return;
    }

    activePlaylistIndex += 1;
    playPlaylistTrack(token);
  };

  activeMusic = audio;
  activeMusicId = nextId;

  void audio.play().catch(() => {});
}

export function initAudio(): void {
  cache.clear();

  for (const id of Object.keys(sounds) as SoundKey[]) {
    const definition = sounds[id];
    const audio = new Audio(definition.src);
    audio.preload = 'auto';
    applyBaseVolume(audio, id);
    cache.set(id, audio);
  }
}

export function unlockAudio(): void {
  unlocked = true;
}

export function setMuted(value: boolean): void {
  muted = value;

  if (muted) {
    if (activeMusic) {
      activeMusic.pause();
    }

    for (const loop of activeLoops.values()) {
      loop.pause();
    }

    return;
  }

  if (musicEnabled && activeMusic) {
    void activeMusic.play().catch(() => {});
  }

  if (sfxEnabled) {
    for (const loop of activeLoops.values()) {
      void loop.play().catch(() => {});
    }
  }
}

export function setMasterVolume(value: number): void {
  masterVolume = clamp(value);

  for (const [id, audio] of cache) {
    applyBaseVolume(audio, id);
  }

  for (const [id, audio] of activeLoops) {
    if (isSoundKey(id)) {
      applyBaseVolume(audio, id);
    }
  }

  if (activeMusic && activeMusicId && isSoundKey(activeMusicId)) {
    applyMusicVolume(activeMusic, activeMusicId);
  }
}

export function setMusicVolume(value: number): void {
  musicVolume = clamp(value);

  if (activeMusic && activeMusicId && isSoundKey(activeMusicId)) {
    applyMusicVolume(activeMusic, activeMusicId);
  }
}

export function setSfxEnabled(value: boolean): void {
  sfxEnabled = value;

  if (!sfxEnabled) {
    for (const loop of activeLoops.values()) {
      loop.pause();
    }

    return;
  }

  if (!muted && unlocked) {
    for (const loop of activeLoops.values()) {
      void loop.play().catch(() => {});
    }
  }
}

export function setMusicEnabled(value: boolean): void {
  musicEnabled = value;

  if (!musicEnabled) {
    if (activeMusic) {
      activeMusic.pause();
    }

    return;
  }

  if (!muted && unlocked && activeMusic) {
    void activeMusic.play().catch(() => {});
  }
}

export function isSfxEnabled(): boolean {
  return sfxEnabled;
}

export function isMusicEnabled(): boolean {
  return musicEnabled;
}

export function playSound(id: string): void {
  if (!unlocked || muted || !sfxEnabled || !isSoundKey(id)) {
    return;
  }

  const base = cache.get(id);
  if (!base) {
    return;
  }

  const audio = base.cloneNode(true) as HTMLAudioElement;
  audio.currentTime = 0;
  applyBaseVolume(audio, id);

  void audio.play().catch(() => {});
}

export function playLoop(id: string): void {
  if (!unlocked || muted || !sfxEnabled || !isSoundKey(id)) {
    return;
  }

  if (activeLoops.has(id)) {
    return;
  }

  const base = cache.get(id);
  if (!base) {
    return;
  }

  const audio = base.cloneNode(true) as HTMLAudioElement;
  audio.loop = true;
  audio.currentTime = 0;
  applyBaseVolume(audio, id);

  activeLoops.set(id, audio);

  void audio.play().catch(() => {});
}

export function stopLoop(id: string): void {
  const audio = activeLoops.get(id);
  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  activeLoops.delete(id);
}

export function playMusic(source: string | readonly string[]): void {
  if (!unlocked || muted || !musicEnabled) {
    return;
  }

  if (typeof source !== 'string') {
    if (source.length === 0) {
      stopMusic();
      return;
    }

    activeMusicToken += 1;

    if (activeMusic) {
      clearActiveMusicHandlers(activeMusic);
      activeMusic.pause();
      activeMusic.currentTime = 0;
    }

    activePlaylist = shuffleStrings(source);
    activePlaylistIndex = 0;
    activeMusic = null;
    activeMusicId = null;

    playPlaylistTrack(activeMusicToken);
    return;
  }

  const id: string = source;

  if (!isSoundKey(id)) {
    return;
  }

  if (activeMusicId === id && activeMusic !== null && activePlaylist === null) {
    return;
  }

  activeMusicToken += 1;
  activePlaylist = null;
  activePlaylistIndex = 0;

  if (activeMusic) {
    clearActiveMusicHandlers(activeMusic);
    activeMusic.pause();
    activeMusic.currentTime = 0;
  }

  const base = cache.get(id);
  if (!base) {
    activeMusic = null;
    activeMusicId = null;
    return;
  }

  const audio = base.cloneNode(true) as HTMLAudioElement;
  audio.loop = true;
  audio.currentTime = 0;
  applyMusicVolume(audio, id);

  activeMusic = audio;
  activeMusicId = id;

  void audio.play().catch(() => {});
}

export function stopMusic(): void {
  activeMusicToken += 1;
  activePlaylist = null;
  activePlaylistIndex = 0;

  if (!activeMusic) {
    activeMusicId = null;
    return;
  }

  clearActiveMusicHandlers(activeMusic);
  activeMusic.pause();
  activeMusic.currentTime = 0;
  activeMusic = null;
  activeMusicId = null;
}
