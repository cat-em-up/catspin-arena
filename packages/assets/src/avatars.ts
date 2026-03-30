// Default
import defn from '../avatars/default-n.png';
import defw from '../avatars/default-w.png';
import defl from '../avatars/default-l.png';

// Cats
import cat1n from '../avatars/cat-1-n.png';
import cat1w from '../avatars/cat-1-w.png';
import cat1l from '../avatars/cat-1-l.png';

import cat2n from '../avatars/cat-2-n.png';
import cat2w from '../avatars/cat-2-w.png';
import cat2l from '../avatars/cat-2-l.png';

import cat3n from '../avatars/cat-3-n.png';
import cat3w from '../avatars/cat-3-w.png';
import cat3l from '../avatars/cat-3-l.png';

// Dogs
import dog1n from '../avatars/dog-1-n.png';
import dog1w from '../avatars/dog-1-w.png';
import dog1l from '../avatars/dog-1-l.png';

import dog2n from '../avatars/dog-2-n.png';
import dog2w from '../avatars/dog-2-w.png';
import dog2l from '../avatars/dog-2-l.png';

import dog3n from '../avatars/dog-3-n.png';
import dog3w from '../avatars/dog-3-w.png';
import dog3l from '../avatars/dog-3-l.png';

// Boars
import boar1n from '../avatars/boar-1-n.png';
import boar1w from '../avatars/boar-1-w.png';
import boar1l from '../avatars/boar-1-l.png';

import boar2n from '../avatars/boar-2-n.png';
import boar2w from '../avatars/boar-2-w.png';
import boar2l from '../avatars/boar-2-l.png';

import boar3n from '../avatars/boar-3-n.png';
import boar3w from '../avatars/boar-3-w.png';
import boar3l from '../avatars/boar-3-l.png';

// Rats
import mouse1n from '../avatars/mouse-1-n.png';
import mouse1w from '../avatars/mouse-1-w.png';
import mouse1l from '../avatars/mouse-1-l.png';

import mouse2n from '../avatars/mouse-2-n.png';
import mouse2w from '../avatars/mouse-2-w.png';
import mouse2l from '../avatars/mouse-2-l.png';

import mouse3n from '../avatars/mouse-3-n.png';
import mouse3w from '../avatars/mouse-3-w.png';
import mouse3l from '../avatars/mouse-3-l.png';

export type AvatarMood = 'n' | 'w' | 'l';

export const avatars = {
  'cat-1': { n: cat1n, w: cat1w, l: cat1l },
  'cat-2': { n: cat2n, w: cat2w, l: cat2l },
  'cat-3': { n: cat3n, w: cat3w, l: cat3l },
  'dog-1': { n: dog1n, w: dog1w, l: dog1l },
  'dog-2': { n: dog2n, w: dog2w, l: dog2l },
  'dog-3': { n: dog3n, w: dog3w, l: dog3l },
  'boar-1': { n: boar1n, w: boar1w, l: boar1l },
  'boar-2': { n: boar2n, w: boar2w, l: boar2l },
  'boar-3': { n: boar3n, w: boar3w, l: boar3l },
  'mouse-1': { n: mouse1n, w: mouse1w, l: mouse1l },
  'mouse-2': { n: mouse2n, w: mouse2w, l: mouse2l },
  'mouse-3': { n: mouse3n, w: mouse3w, l: mouse3l },
  default: { n: defn, w: defw, l: defl },
} as const;

export function getAvatar(value: string, mood: AvatarMood): string {
  const avatar = avatars[value as keyof typeof avatars] ?? avatars.default;
  return avatar[mood];
}
