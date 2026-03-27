type AvatarProps = {
  readonly value: string;
  readonly size?: 'sm' | 'md' | 'lg';
};

export function Avatar({ value, size = 'sm' }: AvatarProps) {
  return <div className={`avatar ${size}`}>{value || '🙂'}</div>;
}
