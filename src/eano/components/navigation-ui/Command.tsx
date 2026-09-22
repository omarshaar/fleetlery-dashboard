import React, { useState } from "react"
import {
  Command as SCommand,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/eano/design-system/shadcn/command"
import { cn } from "@/eano/lib/utils"

/**
 * Unified Command (Command Palette) component.
 * - Single import only.
 * - Fully data-driven structure.
 * - Supports icons, shortcuts, separators, and disabled state.
 */

export type CommandItemType = {
  /** Label displayed for the command */
  label: string
  /** Optional icon element (Lucide icon or custom) */
  icon?: React.ReactNode
  /** Optional shortcut text (⌘S, etc.) */
  shortcut?: string
  /** Disable this item */
  disabled?: boolean
  /** Action callback */
  onSelect?: () => void
}

export type CommandGroupType = {
  /** Group heading text */
  heading?: string
  /** Commands inside the group */
  items: CommandItemType[]
  /** Add separator before the group */
  separatorBefore?: boolean
}

export type CommandProps = {
  /** Placeholder for the search input */
  placeholder?: string
  /** Message shown when no results */
  emptyMessage?: string
  /** Command groups */
  groups: CommandGroupType[]
  /** Optional wrapper classes */
  className?: string
  /** Enable filtering behavior */
  searchable?: boolean
}

/**
 * Example:
 * <Command
 *   placeholder="Type a command or search..."
 *   groups={[
 *     {
 *       heading: "Suggestions",
 *       items: [
 *         { label: "Calendar", icon: <Calendar /> },
 *         { label: "Search Emoji", icon: <Smile /> },
 *         { label: "Calculator", icon: <Calculator />, disabled: true },
 *       ],
 *     },
 *     {
 *       separatorBefore: true,
 *       heading: "Settings",
 *       items: [
 *         { label: "Profile", icon: <User />, shortcut: "⌘P" },
 *         { label: "Billing", icon: <CreditCard />, shortcut: "⌘B" },
 *         { label: "Settings", icon: <Settings />, shortcut: "⌘S" },
 *       ],
 *     },
 *   ]}
 * />
 */
export function Command({
  placeholder = "Type a command or search...",
  emptyMessage = "No results found.",
  groups,
  className,
  searchable = true,
}: CommandProps) {
  const [query, setQuery] = useState("")

  const filteredGroups = searchable
    ? groups.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        ),
      }))
    : groups

  const allEmpty = filteredGroups.every((g) => g.items.length === 0)

  return (
    <SCommand
      className={cn(
        "rounded-lg border shadow-md md:min-w-[450px] h-max",
        className
      )}
    >
      {searchable && (
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={setQuery}
        />
      )}

      <CommandList>
        {allEmpty && <CommandEmpty>{emptyMessage}</CommandEmpty>}

        {filteredGroups.map((group, i) => (
          <React.Fragment key={i}>
            {group.separatorBefore && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.items.map((item, j) => (
                <CommandItem
                  key={j}
                  disabled={item.disabled}
                  onSelect={item.onSelect}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <span className="text-muted-foreground">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </div>
                    {item.shortcut && (
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </SCommand>
  )
}
