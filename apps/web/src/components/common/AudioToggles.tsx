import { useEffect, useState } from 'react';
import { isMusicEnabled, isSfxEnabled, setMusicEnabled, setSfxEnabled } from '../../audio';

const MUSIC_STORAGE_KEY = 'catspin:music-enabled';
const SFX_STORAGE_KEY = 'catspin:sfx-enabled';

function readStoredBoolean(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);
  if (rawValue === null) {
    return fallback;
  }

  return rawValue === 'true';
}

export function AudioToggles() {
  const [musicEnabled, setMusicEnabledState] = useState<boolean>(() =>
    readStoredBoolean(MUSIC_STORAGE_KEY, isMusicEnabled()),
  );
  const [sfxEnabled, setSfxEnabledState] = useState<boolean>(() => readStoredBoolean(SFX_STORAGE_KEY, isSfxEnabled()));

  useEffect(() => {
    setMusicEnabled(musicEnabled);
    setSfxEnabled(sfxEnabled);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MUSIC_STORAGE_KEY, String(musicEnabled));
      window.localStorage.setItem(SFX_STORAGE_KEY, String(sfxEnabled));
    }
  }, [musicEnabled, sfxEnabled]);

  function handleMusicToggle(): void {
    setMusicEnabledState((current) => !current);
  }

  function handleSfxToggle(): void {
    setSfxEnabledState((current) => !current);
  }

  return (
    <div className="audio-toggles" aria-label="Audio controls">
      <button
        type="button"
        className={`audio-toggle ${musicEnabled ? 'is-on' : 'is-off'}`}
        onClick={handleMusicToggle}
        aria-pressed={musicEnabled}
        aria-label={musicEnabled ? 'Disable music' : 'Enable music'}
        title={musicEnabled ? 'Music: on' : 'Music: off'}
      >
        <span className="audio-toggle__icon" aria-hidden="true">
          🎵
        </span>
      </button>

      <button
        type="button"
        className={`audio-toggle ${sfxEnabled ? 'is-on' : 'is-off'}`}
        onClick={handleSfxToggle}
        aria-pressed={sfxEnabled}
        aria-label={sfxEnabled ? 'Disable sounds' : 'Enable sounds'}
        title={sfxEnabled ? 'Sounds: on' : 'Sounds: off'}
      >
        <span className="audio-toggle__icon" aria-hidden="true">
          🔊
        </span>
      </button>
    </div>
  );
}
