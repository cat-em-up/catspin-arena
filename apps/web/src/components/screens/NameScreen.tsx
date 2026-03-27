import { useMemo, useState } from 'react';
import { useClientStore, useClientStoreState } from '../../state/storeContext';
import { Section } from '../layout/Section';
import { Avatar } from '../common/Avatar';

type NameScreenProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

const AVATARS = ['🐱', '🐈', '🐈‍⬛', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

export function NameScreen(props: NameScreenProps) {
  const { isOpen, onClose } = props;

  const store = useClientStore();
  const state = useClientStoreState();

  const [name, setName] = useState(state.playerName);
  const [avatar, setAvatar] = useState(state.playerAvatar || AVATARS[0]);

  const canSubmit = useMemo(() => {
    return name.trim().length > 0;
  }, [name]);

  const handleSubmit = (): void => {
    if (!canSubmit) return;

    state.playerName = name;
    state.playerAvatar = avatar;

    store.setPlayerInfo(name, avatar);

    onClose();
  };

  const handleCancel = (): void => {
    setName(state.playerName);
    setAvatar(state.playerAvatar || AVATARS[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Section title="Enter profile" className="name-screen">
      <div className="name-row">
        <input
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name..."
          maxLength={24}
        />
      </div>

      <div className="avatar-grid">
        {AVATARS.map((emoji) => {
          const selected = avatar === emoji;

          return (
            <button
              key={emoji}
              type="button"
              className={selected ? 'avatar selected' : 'avatar'}
              onClick={() => setAvatar(emoji)}
            >
              <Avatar size='lg' value={emoji} />
            </button>
          );
        })}
      </div>

      <div className="actions">
        <button onClick={handleSubmit} disabled={!canSubmit}>
          Continue
        </button>

        {name.length > 0 && <button onClick={handleCancel}>Cancel</button>}
      </div>
    </Section>
  );
}
