"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/eano/design-system/shadcn/card"
import { TableDynamic } from "@/components"

export default function TablesPage() {
  const invoices = [
    { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
    { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
    { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
    { invoice: "INV004", paymentStatus: "Paid", totalAmount: "$450.00", paymentMethod: "Credit Card" },
    { invoice: "INV005", paymentStatus: "Paid", totalAmount: "$550.00", paymentMethod: "PayPal" },
    { invoice: "INV006", paymentStatus: "Pending", totalAmount: "$200.00", paymentMethod: "Bank Transfer" },
  ]

  const columns = [
    { key: "invoice", label: "Invoice" },
    { key: "paymentStatus", label: "Status" },
    { key: "paymentMethod", label: "Method" },
    { key: "totalAmount", label: "Amount", align: "right" as const },
  ]

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Invoices Table</CardTitle>
        </CardHeader>
        <CardContent>
          <TableDynamic
            caption="A list of your recent invoices."
            columns={columns}
            data={invoices}
            footer={{ label: "Total", totalField: "totalAmount" }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empty Data Example</CardTitle>
        </CardHeader>
        <CardContent>
          <TableDynamic
            caption="An empty data example."
            columns={columns}
            data={[]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
