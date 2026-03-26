import { Section } from '../layout/Section';

type RoomSetupScreenProps = {
  readonly roomInput: string;
  readonly onRoomInputChange: (value: string) => void;
  readonly onCreateRoom: () => void;
  readonly onJoinRoom: () => void;
  readonly canCreate: boolean;
  readonly canJoin: boolean;
};

export function RoomSetupScreen(props: RoomSetupScreenProps) {
  const { roomInput, onRoomInputChange, onCreateRoom, onJoinRoom, canCreate, canJoin } = props;

  return (
    <Section title="Create or join room" className="room-setup">
      <div className="create-row">
        <button type="button" onClick={onCreateRoom} disabled={!canCreate}>
          Create room
        </button>
      </div>

      <div className="join-row">
        <input
          value={roomInput}
          onChange={(event) => onRoomInputChange(event.target.value)}
          placeholder="Room ID"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && canJoin) {
              onJoinRoom();
            }
          }}
        />

        <button type="button" onClick={onJoinRoom} disabled={!canJoin}>
          Join room
        </button>
      </div>
    </Section>
  );
}
