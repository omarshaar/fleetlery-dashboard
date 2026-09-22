/**
 * ImageViewer
 * -----------------------------
 * A minimal but powerful image viewer:
 * - Zoom with mouse wheel
 * - Pan by dragging
 * - Double-click to toggle zoom
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import type { FileItem } from "../types/file-item";

interface ImageViewerProps {
  file: FileItem;
}

export function ImageViewer({ file }: ImageViewerProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const gestureRef = useRef<{
    mode: "none" | "pan" | "pinch";
    panStartX: number;
    panStartY: number;
    pinchStartDistance: number;
    pinchStartScale: number;
    pinchAnchorUx: number;
    pinchAnchorUy: number;
  }>(
    {
      mode: "none",
      panStartX: 0,
      panStartY: 0,
      pinchStartDistance: 0,
      pinchStartScale: 1,
      pinchAnchorUx: 0,
      pinchAnchorUy: 0,
    }
  );

  const lastTapAtRef = useRef(0);
  const didPinchRef = useRef(false);

  const clampScale = (value: number) => {
    if (value < 0.3) return 0.3;
    if (value > 4) return 4;
    return value;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // React attaches some wheel listeners as passive in certain setups,
      // so we use a native listener with passive:false to safely prevent scroll.
      e.preventDefault();

      const direction = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => {
        return clampScale(prev + direction);
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as EventListener);
  }, []);

  const toggleZoom = () => {
    if (scale > 1) {
      setScale(1);
      setOrigin({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  };

  const getTwoPointers = () => {
    const points = Array.from(pointersRef.current.values());
    if (points.length < 2) return null;
    return [points[0], points[1]] as const;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary mouse button
    if (e.pointerType === "mouse" && e.button !== 0) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 1) {
      gestureRef.current.mode = "pan";
      gestureRef.current.panStartX = e.clientX - origin.x;
      gestureRef.current.panStartY = e.clientY - origin.y;
      return;
    }

    if (pointersRef.current.size === 2) {
      const two = getTwoPointers();
      if (!two) return;
      const [p1, p2] = two;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.hypot(dx, dy);

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      gestureRef.current.mode = "pinch";
      gestureRef.current.pinchStartDistance = distance;
      gestureRef.current.pinchStartScale = scale;

      // Anchor in image-space under the midpoint so zoom feels stable.
      gestureRef.current.pinchAnchorUx = (midX - origin.x) / scale;
      gestureRef.current.pinchAnchorUy = (midY - origin.y) / scale;

      didPinchRef.current = true;
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Pinch zoom (two pointers)
    if (gestureRef.current.mode === "pinch" && pointersRef.current.size >= 2) {
      const two = getTwoPointers();
      if (!two) return;
      const [p1, p2] = two;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.hypot(dx, dy);
      if (gestureRef.current.pinchStartDistance <= 0) return;

      const ratio = distance / gestureRef.current.pinchStartDistance;
      const nextScale = clampScale(gestureRef.current.pinchStartScale * ratio);

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      // Keep midpoint anchored (convert back from image-space).
      const nextOrigin = {
        x: midX - gestureRef.current.pinchAnchorUx * nextScale,
        y: midY - gestureRef.current.pinchAnchorUy * nextScale,
      };

      setScale(nextScale);
      setOrigin(nextOrigin);
      return;
    }

    // Pan (single pointer) - only when zoomed-in
    if (gestureRef.current.mode === "pan" && pointersRef.current.size === 1) {
      if (scale <= 1) return;
      setOrigin({
        x: e.clientX - gestureRef.current.panStartX,
        y: e.clientY - gestureRef.current.panStartY,
      });
    }
  };

  const onPointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointersRef.current.has(e.pointerId)) {
      pointersRef.current.delete(e.pointerId);
    }

    // If one pointer remains after a pinch, continue panning from it.
    if (pointersRef.current.size === 1) {
      const remaining = Array.from(pointersRef.current.values())[0];
      gestureRef.current.mode = "pan";
      gestureRef.current.panStartX = remaining.x - origin.x;
      gestureRef.current.panStartY = remaining.y - origin.y;
      return;
    }

    // No pointers left: end gesture + optional double-tap zoom (touch only).
    gestureRef.current.mode = "none";

    if (e.pointerType === "touch" && !didPinchRef.current) {
      const now = Date.now();
      const dt = now - lastTapAtRef.current;
      if (dt > 0 && dt < 280) {
        lastTapAtRef.current = 0;
        toggleZoom();
      } else {
        lastTapAtRef.current = now;
      }
    }

    didPinchRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden bg-muted rounded-lg select-none touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUpOrCancel}
      onPointerCancel={onPointerUpOrCancel}
    >
      <img
        ref={imgRef}
        src={file.url}
        alt={file.name}
        draggable={false}
        onDoubleClick={toggleZoom}
        className="select-none"
        style={{
          transform: `translate(${origin.x}px, ${origin.y}px) scale(${scale})`,
          cursor: scale > 1 ? "grab" : "default",
        }}
      />
    </div>
  );
}
