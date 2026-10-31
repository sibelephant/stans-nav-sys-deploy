import { useId, type ReactNode } from "react";
import { Button, Title1, Body1 } from "@fluentui/react-components";
import { ArrowRightRegular } from "@fluentui/react-icons";

export function Hero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  secondaryTo = "#comparison",
  primaryTo = "#route-planner",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
  primaryTo?: string;
  secondaryTo?: string;
}) {
  const uid = useId();
  const idA = `mesh-a-${uid}`;
  const idB = `mesh-b-${uid}`;
  return (
    <section className="relative overflow-hidden grid gap-3 rounded-[10px] text-white p-[clamp(24px,4vw,42px)] bg-[linear-gradient(130deg,#087e8b,#145c68_58%,#f4a261)] shadow-[var(--shadow-hero)]">
      <svg
        className="absolute inset-0 w-full h-full opacity-55 pointer-events-none"
        aria-hidden="true"
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id={idA}>
            <stop offset="0" stopColor="#F4A261" stopOpacity=".55" />
            <stop offset="1" stopColor="#F4A261" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={idB}>
            <stop offset="0" stopColor="#087E8B" stopOpacity=".55" />
            <stop offset="1" stopColor="#087E8B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="400" fill={`url(#${idA})`} />
        <rect width="800" height="400" fill={`url(#${idB})`} x="300" y="80" />
      </svg>

      <span className="relative z-1 text-[11px] tracking-[0.12em] font-bold uppercase opacity-90 inline-flex items-center">
        <span className="w-1.5 h-1.5 rounded-full inline-block mr-1.5 bg-[#f4a261]" />
        {eyebrow}
      </span>
      <div className="relative z-1 max-w-[24ch]">
        <Title1 className="text-white! max-w-[24ch]">{title}</Title1>
      </div>
      <div className="relative z-1 max-w-[68ch]">
        <Body1 className="text-white! max-w-[68ch] opacity-90">{subtitle}</Body1>
      </div>
      <div className="relative z-1 flex items-center gap-2.5 flex-wrap mt-1.5">
        <Button
          appearance="primary"
          icon={<ArrowRightRegular />}
          as="a"
          href={primaryTo}
        >
          {primary}
        </Button>
        <Button appearance="secondary" as="a" href={secondaryTo}>
          {secondary}
        </Button>
      </div>
    </section>
  );
}
