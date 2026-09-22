/**
 * FileFilterKind
 *
 * Simple filter categories that can be applied
 * on top of the full file list.
 */
export type FileFilterKind = "type" | "extension" | "query";

/**
 * FileFilter
 *
 * Represents a single active filter in the file browser.
 *
 * Examples:
 * - { kind: "type", value: "image" }
 * - { kind: "extension", value: "pdf" }
 * - { kind: "query", value: "invoice" }
 */
export interface FileFilter {
  kind: FileFilterKind;
  value: string;
}
