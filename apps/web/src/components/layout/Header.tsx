import { SocketStatus } from '../../network/socket';

type HeaderProps = {
  readonly connectionStatus: SocketStatus;
  readonly playerName: string;
  readonly onChangeName: () => void;
};

export function Header({ connectionStatus, playerName, onChangeName }: HeaderProps) {
  const hasPlayerName = playerName.trim().length > 0;
  const displayName = hasPlayerName ? playerName : 'Guest';

  return (
    <header className="app-header">
      <h1 className="title">CatSpin Arena</h1>

      <div className="user">
        <button type="button" onClick={onChangeName}>
          {displayName}
        </button>

        <span className="status" data-status={connectionStatus} />
      </div>
    </header>
  );
}
