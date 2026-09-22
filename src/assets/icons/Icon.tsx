// src/assets/icons/Icon.tsx
import React from "react";
import { IconsList, type IconName } from "./iconsList";
import { patchSvg } from "./utils";

export type IconProps = {
  name: IconName | string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 1.5,
  className,
  style,
  title,
}) => {
  const raw = (IconsList as Record<string, string>)[name];

  if (!raw) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Icon "${name}" not found`);
    }
    return null;
  }

  const svg = patchSvg({ svg: raw, size, color, strokeWidth });

  const withTitle =
    title && !/<title>/i.test(svg)
      ? svg.replace(/<svg\b([^>]*)>/i, `<svg$1><title>${title}</title>`)
      : svg;

  return (
    <span
      className={className}
      style={{ display: "inline-block", lineHeight: 0, ...style }}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: withTitle }}
    />
  );
};
