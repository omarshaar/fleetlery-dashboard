/**
 * @file feature-presets.ts
 * @description Helper utilities for building DataTable features easily
 */

import type { DataTableFeatures, FeaturePreset } from "../types"

/**
 * Converts a preset name to a features configuration
 */
export function getPresetFeatures<T extends Record<string, any>>(
  preset: FeaturePreset
): DataTableFeatures<T> {
  switch (preset) {
    case "simple":
      return {}

    case "basic":
      return {
        search: { mode: "local" },
        sorting: true,
      }

    case "standard":
      return {
        search: { mode: "local" },
        sorting: true,
        pagination: {
          type: "client",
          pageSize: 10,
        },
      }

    case "advanced":
      return {
        search: { mode: "local" },
        sorting: true,
        pagination: {
          type: "client",
          pageSize: 10,
        },
        selectable: true,
        hideableColumns: true,
      }

    case "full":
      return {
        search: { mode: "local" },
        sorting: true,
        pagination: {
          type: "client",
          pageSize: 10,
        },
        selectable: true,
        hideableColumns: true,
      }

    default:
      return {}
  }
}

/**
 * Builds features from boolean shortcuts
 */
export function buildFeaturesFromBooleans<T extends Record<string, any>>(
  enableSearch?: boolean,
  enableSorting?: boolean,
  enablePagination?: boolean,
  enableSelection?: boolean,
  enableColumnToggle?: boolean
): DataTableFeatures<T> {
  const features: DataTableFeatures<T> = {}

  if (enableSearch) {
    features.search = { mode: "local" }
  }

  if (enableSorting) {
    features.sorting = true
  }

  if (enablePagination) {
    features.pagination = {
      type: "client",
      pageSize: 10,
    }
  }

  if (enableSelection) {
    features.selectable = true
  }

  if (enableColumnToggle) {
    features.hideableColumns = true
  }

  return features
}

/**
 * Merges features from preset, booleans, and explicit features object.
 * Priority: explicit features > booleans > preset
 */
export function resolveFeatures<T extends Record<string, any>>(
  preset?: FeaturePreset,
  enableSearch?: boolean,
  enableSorting?: boolean,
  enablePagination?: boolean,
  enableSelection?: boolean,
  enableColumnToggle?: boolean,
  explicitFeatures?: DataTableFeatures<T>
): DataTableFeatures<T> {
  // If explicit features provided, use them directly
  if (explicitFeatures && Object.keys(explicitFeatures).length > 0) {
    return explicitFeatures
  }

  // Check if any boolean shortcut is used
  const hasBooleanShortcuts =
    enableSearch ||
    enableSorting ||
    enablePagination ||
    enableSelection ||
    enableColumnToggle

  // If booleans are used, build from them
  if (hasBooleanShortcuts) {
    return buildFeaturesFromBooleans(
      enableSearch,
      enableSorting,
      enablePagination,
      enableSelection,
      enableColumnToggle
    )
  }

  // Otherwise, use preset if provided
  if (preset) {
    return getPresetFeatures(preset)
  }

  // Default: empty features
  return {}
}
