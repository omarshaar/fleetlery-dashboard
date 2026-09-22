export function patchSvg({
  svg,
  size,
  color,
  strokeWidth,
}: {
  svg: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}) {
  let out = svg.trim();

  out = out.replace(/width="[^"]*"/gi, "").replace(/height="[^"]*"/gi, "");

  if (/stroke="/i.test(out)) {
    out = out.replace(/stroke="[^"]*"/gi, `stroke="${color ?? "currentColor"}"`);
  } else {
    out = out.replace(/<svg\b([^>]*)>/i, `<svg$1 stroke="${color ?? "currentColor"}">`);
  }

  if (typeof strokeWidth === "number") {
    if (/stroke-width="/i.test(out)) {
      out = out.replace(/stroke-width="[^"]*"/gi, `stroke-width="${strokeWidth}"`);
    } else {
      out = out.replace(/<svg\b([^>]*)>/i, `<svg$1 stroke-width="${strokeWidth}">`);
    }
  }

  const w = size ?? 24;
  const h = size ?? 24;
  out = out.replace(/<svg\b([^>]*)>/i, `<svg$1 width="${w}" height="${h}">`);

  return out;
}
