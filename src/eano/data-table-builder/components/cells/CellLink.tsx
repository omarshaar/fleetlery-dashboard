/**
 * @file CellLink.tsx
 * @description A simple link-like cell with Tailwind hover styles.
 */

export function CellLink({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
    >
      {text}
    </button>
  )
}
