import type { ReactNode } from "react";

type SectionProps = {
  readonly title: string;
  readonly children: ReactNode;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export function Section({ title, children, actions, className }: SectionProps) {
  const classes = ["section", className].filter(Boolean).join(" ");

  return (
    <section className={classes}>
      <div className="section-header">
        <h2>{title}</h2>
        {actions ? (
          <div className="section-actions inline wrap">{actions}</div>
        ) : null}
      </div>

      {children}
    </section>
  );
}
