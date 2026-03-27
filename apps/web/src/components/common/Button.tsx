import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { playSound, type SoundId } from '../../audio';

type Props = {
  readonly sound?: SoundId;
  readonly children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: Props) {
  const { sound, onClick, children, ...rest } = props;

  const handleClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] = (event) => {
    if (sound) {
      playSound(sound);
    }

    onClick?.(event);
  };

  return (
    <button {...rest} onClick={handleClick}>
      {children}
    </button>
  );
}
