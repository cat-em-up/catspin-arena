import { useState } from "react";
import { Section } from "../layout/Section";

type NameScreenProps = {
  readonly initialValue: string;
  readonly onSubmit: (name: string) => void;
};

export function NameScreen(props: NameScreenProps) {
  const { initialValue, onSubmit } = props;
  const [name, setName] = useState<string>(initialValue);

  return (
    <Section title="Enter your name">
      <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit(name);
            }
          }}
        />

        <button
          type="button"
          onClick={() => onSubmit(name)}
          disabled={name.trim().length === 0}
        >
          Continue
        </button>
      </div>
    </Section>
  );
}
