import type { ReactNode } from "react";

type SectionProps = {
  readonly title: string;
  readonly children: ReactNode;
};

export function Section(props: SectionProps) {
  const { title, children } = props;

  return (
    <section
      style={{
        marginBottom: 24,
        padding: 16,
        border: "1px solid #ccc",
        borderRadius: 12,
      }}
    >
      <h2>{title}</h2>
      {children}
    </section>
  );
}
