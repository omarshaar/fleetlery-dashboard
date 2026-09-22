/**
 * @file CellImage.tsx
 * @description Displays an image cell with fallback style.
 */

export function CellImage({ src, alt }: { src: string; alt?: string }) {
  return (
      <img
        src={src}
        alt={alt ?? ""}
        className="h-14 w-16 rounded-md object-cover border border-border"
      />
  )
}
