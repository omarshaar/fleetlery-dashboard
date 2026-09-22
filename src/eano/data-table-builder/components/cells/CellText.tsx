/**
 * @file CellText.tsx
 * @description Displays simple text with consistent spacing and wrapping rules.
 */

export function CellText({
  text,
  align = "left",
}: {
  text: string | number
  align?: "left" | "center" | "right"
}) {
  return (
    <div
      className={`text-sm text-foreground break-words whitespace-normal overflow-hidden text-ellipsis pe-2
        ${align === "center" ? "text-center" : align === "right" ? "text-right" : ""}`}
      style={{ wordBreak: "break-word" }}
    >
      {String(text)}
    </div>
  )
}
