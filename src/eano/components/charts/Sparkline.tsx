import { useMemo } from "react";

export function Sparkline({ points, positive = true }: { points: number[]; positive?: boolean }) {
  const path = useMemo(() => {
    if (!points.length) return "";
    const w = 120; const h = 36; const max = Math.max(...points); const min = Math.min(...points);
    const scaleX = (i: number) => (i / (points.length - 1)) * (w - 2) + 1;
    const scaleY = (v: number) => h - ((v - min) / (max - min || 1)) * (h - 2) - 1;
    return points.map((v, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(v)}`).join(" ");
  }, [points]);
  return (
    <svg viewBox="0 0 120 36" className="w-[120px] h-9">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className={positive ? "text-emerald-500" : "text-red-500"} />
    </svg>
  );
}