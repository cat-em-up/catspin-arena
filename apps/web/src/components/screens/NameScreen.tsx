import { useMemo, useState } from 'react';
import { playSound } from '../../audio';
import { useClientStore, useClientStoreState } from '../../state/storeContext';
import { Section } from '../layout/Section';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

type NameScreenProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

const AVATARS = ['cat-1', 'cat-2', 'cat-3'];

export function NameScreen(props: NameScreenProps) {
  const { isOpen, onClose } = props;

  const store = useClientStore();
  const state = useClientStoreState();

  const [name, setName] = useState(state.playerName);
  const [avatar, setAvatar] = useState(state.playerAvatar || AVATARS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim().length > 0;
  }, [name]);

  const handleSubmit = (): void => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    state.playerName = name;
    state.playerAvatar = avatar;

    store.setPlayerInfo(name, avatar);

    playSound('meow');

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleCancel = (): void => {
    if (isSubmitting) return;

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
          disabled={isSubmitting}
        />
      </div>

      <div className="avatar-grid">
        {AVATARS.map((item) => {
          const selected = avatar === item;

          return (
            <Button
              key={item}
              type="button"
              className={selected ? 'avatar selected' : 'avatar'}
              onClick={() => setAvatar(item)}
              disabled={isSubmitting}
              sound="click"
            >
              <Avatar size="lg" value={item} mood={selected && isSubmitting ? 'win' : 'neutral'} />
            </Button>
          );
        })}
      </div>

      <div className="actions">
        <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} sound="click">
          Continue
        </Button>

        {name.length > 0 && (
          <Button onClick={handleCancel} disabled={isSubmitting} sound="click">
            Cancel
          </Button>
        )}
      </div>
    </Section>
  );
}
