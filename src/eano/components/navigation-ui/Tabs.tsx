import React, { useState } from "react"
import {
  Tabs as STabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/eano/design-system/shadcn/tabs"
import { cn } from "@/eano/lib/utils"

/**
 * Unified Tabs component.
 * - Simple API: pass an array of tab objects.
 * - Each tab has: value, label, and optional content.
 * - No need to import subcomponents manually.
 */

export type TabItem = {
  /** Unique value of the tab */
  value: string
  /** Label shown on the tab button */
  label: string
  /** Content shown when tab is active */
  content: React.ReactNode
}

export type TabsProps = {
  /** Array of tab definitions */
  tabs: TabItem[]
  /** Default active tab value */
  defaultValue?: string
  /** Controlled active tab value */
  value?: string
  /** Callback when tab changes */
  onChange?: (value: string) => void
  /** Optional class for the wrapper */
  className?: string
  /** Optional class for content container */
  contentClassName?: string
}

/**
 * Example:
 * <Tabs
 *   defaultValue="account"
 *   tabs={[
 *     { value: "account", label: "Account", content: <AccountCard /> },
 *     { value: "password", label: "Password", content: <PasswordCard /> },
 *   ]}
 * />
 */
export function Tabs({
  tabs,
  defaultValue,
  value,
  onChange,
  className,
  contentClassName,
}: TabsProps) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value)
  const isControlled = value !== undefined
  const activeValue = isControlled ? value : active

  function handleChange(newValue: string) {
    if (!isControlled) setActive(newValue)
    onChange?.(newValue)
  }

  return (
    <STabs
      value={activeValue}
      defaultValue={defaultValue}
      onValueChange={handleChange}
      className={cn("w-full", className)}
    >
      <TabsList className="w-full justify-start">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={cn("mt-3 rounded-md border p-3", contentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </STabs>
  )
}
