"use client";

/**
 * WidgetWithSkeleton HOC
 *
 * Higher-order component that wraps any widget to show a skeleton
 * when data is null or undefined.
 *
 * Usage:
 * const SkeletonStatMini = withWidgetSkeleton(StatMiniWidget, StatMiniSkeleton);
 * <SkeletonStatMini data={data} {...otherProps} />;
 */

import React from "react";
import { isDataValid } from "./WidgetSkeletons";

interface WidgetWithSkeletonProps {
  data: any;
  [key: string]: any;
}

export function withWidgetSkeleton<P extends { data: any } = WidgetWithSkeletonProps>(
  WidgetComponent: React.ComponentType<P>,
  SkeletonComponent: React.ComponentType<any>,
  customDataValidator?: (data: any) => boolean
) {
  const displayName = WidgetComponent.displayName || WidgetComponent.name || "Widget";

  function WithSkeleton(props: P & React.HTMLAttributes<HTMLDivElement>) {
    const { data, ...restProps } = props;
    const dataIsValid = customDataValidator ? customDataValidator(data) : isDataValid(data);

    if (!dataIsValid) {
      return <SkeletonComponent {...restProps} />;
    }

    return <WidgetComponent {...(props as P)} />;
  }

  WithSkeleton.displayName = `withSkeleton(${displayName})`;

  return WithSkeleton as React.ComponentType<P>;
}

export default withWidgetSkeleton;
