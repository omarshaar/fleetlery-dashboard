"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/eano/design-system/shadcn/table"

export interface TableColumn {
  key: string
  label: string
  align?: "left" | "right" | "center"
}

export interface TableDynamicProps {
  caption?: string
  columns: TableColumn[]
  data: Record<string, any>[]
  footer?: {
    label?: string
    totalField?: string
  }
}

/**
 * Dynamic Table Component
 * - Renders a responsive table based on provided columns and data.
 * - You can optionally show a caption and footer total.
 */
export function TableDynamic({
  caption = "Data table",
  columns,
  data,
  footer,
}: TableDynamicProps) {
  // Calculate total if footer.totalField exists
  const total =
  footer?.totalField && data.length > 0
    ? data
        .map((item) => {
          const field = footer.totalField!
          const rawValue = item[field]
          const num = parseFloat(String(rawValue).replace(/[^0-9.-]+/g, ""))
          return isNaN(num) ? 0 : num
        })
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
    : null

  return (
    <Table>
      <TableCaption>{caption}</TableCaption>

      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}
            >
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length > 0 ? (
          data.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}
                >
                  {row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      {footer && total && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length - 1}>{footer.label || "Total"}</TableCell>
            <TableCell className="text-right">${total}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}
