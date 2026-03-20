import { Section } from "../layout/Section";

type RoomSetupScreenProps = {
  readonly playerName: string;
  readonly roomInput: string;
  readonly onRoomInputChange: (value: string) => void;
  readonly onCreateRoom: () => void;
  readonly onJoinRoom: () => void;
  readonly onChangeName: () => void;
  readonly canCreate: boolean;
  readonly canJoin: boolean;
};

export function RoomSetupScreen(props: RoomSetupScreenProps) {
  const {
    playerName,
    roomInput,
    onRoomInputChange,
    onCreateRoom,
    onJoinRoom,
    onChangeName,
    canCreate,
    canJoin,
  } = props;

  return (
    <Section title="Create or Join room">
      <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span>
            Player name: <strong>{playerName}</strong>
          </span>

          <button type="button" onClick={onChangeName}>
            Change
          </button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={roomInput}
            onChange={(event) => onRoomInputChange(event.target.value)}
            placeholder="Room ID"
            onKeyDown={(event) => {
              if (event.key === "Enter" && canJoin) {
                onJoinRoom();
              }
            }}
            style={{ flex: 1 }}
          />

          <button type="button" onClick={onJoinRoom} disabled={!canJoin}>
            Join Room
          </button>
        </div>

        <button type="button" onClick={onCreateRoom} disabled={!canCreate}>
          Create Room
        </button>
      </div>
    </Section>
  );
}
