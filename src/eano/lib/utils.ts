/**
 * @fileoverview Core Utility Functions Library
 * 
 * This module provides essential utility functions for the EANO Framework, including:
 * - CSS class merging with Tailwind CSS support
 * - Nested object value access using dot notation
 * 
 * @author EANO Framework Team
 * @version 1.0.0
 * @since 2026-01-01
 */

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge multiple CSS class names together with full Tailwind CSS support.
 * 
 * Combines clsx for conditional class logic with tailwind-merge to resolve
 * conflicting Tailwind utilities, ensuring proper CSS precedence and avoiding
 * style conflicts in responsive designs.
 * 
 * @function cn
 * @param {...any[]} inputs - Variable number of class strings, objects, or arrays
 * @returns {string} Merged and deduplicated class string
 * 
 * @example
 * // Basic usage
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4"
 * 
 * @example
 * // Conditional classes
 * cn("px-2", isActive && "bg-blue-500", isMobile ? "w-full" : "w-96")
 * 
 * @example
 * // Object notation with clsx
 * cn({ "text-red-500": isError, "text-green-500": isSuccess })
 * 
 * @example
 * // Array of classes
 * cn(["p-2", "m-1"], ["border", "rounded"])
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely retrieve nested object values using dot-notation path syntax.
 * 
 * Provides safe access to deeply nested object properties without throwing errors
 * when intermediate properties don't exist. Uses dot-separated string paths for
 * intuitive key traversal through object hierarchies.
 * 
 * @function getNestedValue
 * @param {Record<string, any>} obj - The target object to traverse
 * @param {string} path - Dot-separated path to the nested value (e.g., "user.address.city")
 * @returns {any} The value at the specified path, or undefined if path doesn't exist
 * 
 * @example
 * // Basic nested access
 * const user = { name: "John", address: { city: "NYC" } };
 * getNestedValue(user, "address.city") // Returns "NYC"
 * 
 * @example
 * // Missing intermediate property
 * const user = { name: "John" };
 * getNestedValue(user, "address.city") // Returns undefined (no error thrown)
 * 
 * @example
 * // Deep nesting
 * const data = { a: { b: { c: { d: "value" } } } };
 * getNestedValue(data, "a.b.c.d") // Returns "value"
 * 
 * @example
 * // With default value pattern
 * const value = getNestedValue(user, "profile.avatar") || "default-avatar.png"
 */
export function getNestedValue(obj: Record<string, any>, path: string): any {
  if (!obj || !path) return undefined

  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key]
    }
    return undefined
  }, obj)
}
