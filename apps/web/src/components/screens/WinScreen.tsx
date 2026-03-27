import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { RoomDTO } from '@catspin/protocol';
import { playSound } from '../../audio';
import type { PlayerView } from '../../types/playerView';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

type WinScreenProps = {
  readonly room: RoomDTO | null;
  readonly playerId: string | null;
  readonly onLeaveRoom: () => void;
};

type CoinStyle = CSSProperties & {
  readonly '--x': string;
  readonly '--size': string;
  readonly '--duration': string;
  readonly '--delay': string;
  readonly '--drift': string;
  readonly '--rotate': string;
  readonly '--opacity': string;
};

function getWinner(room: RoomDTO): PlayerView | null {
  const alive = room.game.players.filter((player) => player.isEliminated === false);

  if (alive.length === 1) {
    return alive[0] ?? null;
  }

  const sorted = [...room.game.players].sort((a, b) => b.balance - a.balance);

  return sorted[0] ?? null;
}

function createCoinStyle(): CoinStyle {
  const depth = Math.random();

  const x = `${Math.random() * 100}%`;
  const size = `${20 + depth * 52}px`;
  const duration = `${2.6 + (1 - depth) * 2.4}s`;
  const delay = `${Math.random() * 2.2}s`;

  const horizontalDirection = Math.random() > 0.5 ? 1 : -1;
  const drift = `${horizontalDirection * (10 + Math.random() * 28)}px`;
  const rotate = `${360 + Math.random() * 900}deg`;
  const opacity = `${0.45 + depth * 0.55}`;

  return {
    '--x': x,
    '--size': size,
    '--duration': duration,
    '--delay': delay,
    '--drift': drift,
    '--rotate': rotate,
    '--opacity': opacity,
    zIndex: `${Math.floor(depth * 10)}`,
  };
}

export function WinScreen(props: WinScreenProps) {
  const { room, playerId, onLeaveRoom } = props;

  const [visible, setVisible] = useState(false);
  const playedWinKeyRef = useRef<string | null>(null);

  const isFinished = room?.game.status === 'finished';

  const winner = useMemo(() => {
    if (!room || !isFinished) {
      return null;
    }

    return getWinner(room);
  }, [room, isFinished]);

  const coins = useMemo(
    () => Array.from({ length: 34 }, (_, index) => ({ id: `coin-${index}`, style: createCoinStyle() })),
    [room?.id, room?.game.round.index, visible],
  );

  useEffect(() => {
    if (!isFinished) {
      setVisible(false);
      playedWinKeyRef.current = null;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setVisible(true);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [isFinished, room?.game.round.index]);

  useEffect(() => {
    if (!room || !isFinished || !visible || !winner) {
      return;
    }

    const winKey = `${room.id}:${room.game.round.index}:${winner.id}`;

    if (playedWinKeyRef.current === winKey) {
      return;
    }

    playedWinKeyRef.current = winKey;
    playSound('win');
  }, [room, isFinished, visible, winner]);

  if (!room || !isFinished || !visible || !winner) {
    return null;
  }

  return (
    <div className="win-overlay">
      <div className="coin-rain" aria-hidden="true">
        {coins.map((coin) => (
          <span key={coin.id} className="coin" style={coin.style} />
        ))}
      </div>

      <div className="win-card">
        <div className="label">Game finished</div>

        <h2 className="title">🏆 Winner</h2>

        <div className="player">
          <Avatar value={winner.avatar} size="lg" mood="win" />
          <div className="name">{winner.id === playerId ? 'You' : winner.name}</div>
          <div className="balance">{winner.balance}</div>
        </div>

        <Button onClick={onLeaveRoom} sound="click">
          Leave
        </Button>
      </div>
    </div>
  );
}
