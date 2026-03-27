import { SocketStatus } from '../../network/socket';
import { useClientStoreState } from '../../state/storeContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

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
        <Button type="button" onClick={onChangeName} sound="click">
          <Avatar value={state.playerAvatar} />
          {state.playerName || 'Guest'}
        </Button>

        <span className="status" data-status={connectionStatus} />
      </div>
    </header>
  );
}
