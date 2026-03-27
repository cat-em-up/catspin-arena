import { SocketStatus } from '../../network/socket';
import { useClientStoreState } from '../../state/storeContext';
import { Avatar } from '../common/Avatar';

type HeaderProps = {
  readonly connectionStatus: SocketStatus;
  readonly onChangeName: () => void;
};

export function Header({ connectionStatus, onChangeName }: HeaderProps) {
  const state = useClientStoreState();

  return (
    <header className="app-header">
      <h1 className="title">CatSpin Arena</h1>

      <div className="user">
        <button type="button" onClick={onChangeName}>
          <Avatar value={state.playerAvatar} />
          {state.playerName || 'Guest'}
        </button>

        <span className="status" data-status={connectionStatus} />
      </div>
    </header>
  );
}
