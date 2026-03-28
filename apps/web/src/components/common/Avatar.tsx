import { useEffect, useState } from 'react';
import { getAvatar } from '@catspin/assets';

type AvatarProps = {
  readonly value: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly mood?: 'neutral' | 'win' | 'lose';
};

const SUFFIX = {
  neutral: 'n',
  win: 'w',
  lose: 'l',
} as const;

export function Avatar({ value, size = 'sm', mood = 'neutral' }: AvatarProps) {
  const [currentMood, setCurrentMood] = useState(mood);

  useEffect(() => {
    setCurrentMood(mood);

    if (mood !== 'win') {
      return;
    }

    let isAlt = false;

    const interval = setInterval(() => {
      isAlt = !isAlt;
      setCurrentMood(isAlt ? 'win' : 'neutral');
    }, 400);

    return () => clearInterval(interval);
  }, [mood]);

  const suffix = SUFFIX[currentMood];
  const src = getAvatar(value, suffix);

  return (
    <div className={`avatar ${size}`}>
      <img src={src} alt={value} draggable={false} />
    </div>
  );
}
