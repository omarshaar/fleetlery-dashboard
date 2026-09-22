/**
 * @file ResizablePanels.tsx
 * @description Unified wrapper for resizable panel groups with simple props.
 */

import * as React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/eano/design-system/shadcn/resizable";
import { cn } from "@/eano/lib/utils";

export type ResizablePanelsProps = {
  /** Direction of split: "horizontal" or "vertical" */
  direction?: "horizontal" | "vertical";

  /** Panels content as array of React nodes */
  panels: React.ReactNode[];

  /** Default sizes for panels (must match panels count, values in %) */
  defaultSizes?: number[];

  /** Optional min size for each panel in % */
  minSizes?: number[];

  /** Add rounded border around the group */
  bordered?: boolean;

  /** Extra class names for the group */
  className?: string;

  /** Height of the whole area (for horizontal splits) */
  height?: number | string;

  /** Width of the whole area (for vertical splits) */
  width?: number | string;
};

/**
 * Single unified ResizablePanels component.
 * Automatically injects handles between panels.
 */
export function ResizablePanels({
  direction = "horizontal",
  panels,
  defaultSizes,
  minSizes,
  bordered = true,
  className,
  height = "150px",
  width = "100%",
}: ResizablePanelsProps) {
  const style: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
  };

  return (
    <ResizablePanelGroup
      direction={direction}
      className={cn(
        bordered && "rounded-lg border",
        "overflow-hidden",
        className
      )}
      style={style}
    >
      {panels.map((panel, i) => (
        <React.Fragment key={i}>
          <ResizablePanel
            defaultSize={defaultSizes?.[i] ?? 100 / panels.length}
            minSize={minSizes?.[i]}
          >
            <div className="flex h-full w-full items-center justify-center bg-muted">
              {panel}
            </div>
          </ResizablePanel>
          {i < panels.length - 1 && <ResizableHandle />}
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  );
}
