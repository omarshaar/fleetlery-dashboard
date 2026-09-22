/**
 * @file useFiltering.ts
 * @description Handles client-side filtering (search) for the DataTable.
 */

import { useMemo } from "react"

export function useFiltering<T extends Record<string, any>>(
  data: T[],
  searchValue: string,
  searchColumns?: (keyof T | string)[],
  caseSensitive = false,
  minChars = 0,
) {
  const filteredData = useMemo(() => {
    if (!searchValue || searchValue.trim() === "") return data
    
    const term = searchValue.trim();
    
    // Check minimum characters
    if (minChars > 0 && term.length < minChars) {
      return data;
    }
    
    const searchTerm = caseSensitive ? term : term.toLowerCase();

    return data.filter((row) => {
      const valuesToSearch = searchColumns
        ? searchColumns.map((col) => row[col as keyof T])
        : Object.values(row)
      
      return valuesToSearch.some((val) => {
        const stringValue = String(val ?? "");
        const searchableValue = caseSensitive ? stringValue : stringValue.toLowerCase();
        return searchableValue.includes(searchTerm);
      });
    });
  }, [data, searchValue, searchColumns, caseSensitive, minChars]);

  return filteredData;
}
