import type { ReactNode } from "react";

import { LoadingState } from "./LoadingState";
import { DataErrorState } from "./DataErrorState";
import { DataEmptyState } from "./DataEmptyState";

export type DataStateGateProps<TData> = {
  isLoading?: boolean;
  isError?: boolean;
  data?: TData[] | null;
  children?: ReactNode;
  /** Optional loading text used by the default loading UI. */
  loadingText?: string;
  /** Optional error text used by the default error UI. */
  errorText?: string;
  /**
   * When true, render an empty state (instead of null) if data is empty.
   * Defaults to false to preserve legacy behavior.
   */
  showEmpty?: boolean;
  /** Optional custom empty UI override. */
  empty?: ReactNode;
  /** Optional empty text used by the default empty UI. */
  emptyText?: string;
};

export function DataStateGate<TData>({
  isLoading = false,
  isError = false,
  data,
  children,
  loadingText,
  errorText,
  showEmpty = false,
  empty,
  emptyText,
}: DataStateGateProps<TData>) {
  if (isLoading) return <LoadingState text={loadingText} />;
  if (isError) return <DataErrorState text={errorText} />;

  if (Array.isArray(data) && data.length > 0) {
    return <>{children}</>;
  }

  if (showEmpty) {
    return <>{empty ?? <DataEmptyState text={emptyText} />}</>;
  }

  return null;
}
