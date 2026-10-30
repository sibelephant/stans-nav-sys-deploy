import type { ReactNode } from "react";
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
  return (
    <section className="hero">
      <svg
        className="hero-mesh"
        aria-hidden="true"
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="mesh-a">
            <stop offset="0" stopColor="#F4A261" stopOpacity=".55" />
            <stop offset="1" stopColor="#F4A261" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mesh-b">
            <stop offset="0" stopColor="#087E8B" stopOpacity=".55" />
            <stop offset="1" stopColor="#087E8B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="400" fill="url(#mesh-a)" />
        <rect width="800" height="400" fill="url(#mesh-b)" x="300" y="80" />
      </svg>
      <span className="eyebrow">
        <span className="eyebrow-dot" />
        {eyebrow}
      </span>
      <Title1>{title}</Title1>
      <Body1>{subtitle}</Body1>
      <div className="hero-actions">
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
