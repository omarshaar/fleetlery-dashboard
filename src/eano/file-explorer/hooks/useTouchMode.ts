"use client";

import * as React from "react";

function getIsTouchLike() {
  if (typeof window === "undefined") return false;

  // Prefer coarse pointer detection (more reliable than width).
  const mql = window.matchMedia?.("(any-pointer: coarse)");
  if (mql?.matches) return true;

  // Fallbacks
  const nav = window.navigator as Navigator & {
    msMaxTouchPoints?: number;
  };

  return (
    (typeof nav.maxTouchPoints === "number" && nav.maxTouchPoints > 0) ||
    (typeof nav.msMaxTouchPoints === "number" && nav.msMaxTouchPoints > 0)
  );
}

/**
 * True when the device is touch-first (coarse pointer).
 * Used to switch UX: tap-to-open, long-press actions, disable HTML5 DnD.
 */
export function useTouchMode() {
  const [isTouchMode, setIsTouchMode] = React.useState(false);

  React.useEffect(() => {
    const update = () => setIsTouchMode(getIsTouchLike());

    update();

    const mql = window.matchMedia?.("(any-pointer: coarse)");
    if (!mql) return;

    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isTouchMode;
}
