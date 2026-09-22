import React, { useState } from "react"
import {
  DropdownMenu as SDropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuShortcut,
} from "@/eano/design-system/shadcn/dropdown-menu"
import { cn } from "@/eano/lib/utils"

/**
 * Unified DropdownMenu component.
 * - Simple data-driven API.
 * - Supports nested submenus.
 * - No need to import any subcomponents.
 */

export type DropdownItem = {
  /** Text or node shown inside item */
  label: string
  /** Optional keyboard shortcut (⌘S etc.) */
  shortcut?: string
  /** Disable this item */
  disabled?: boolean
  /** Callback when clicked */
  onClick?: () => void
  /** Divider before item */
  separatorBefore?: boolean
  /** Submenu items */
  children?: DropdownItem[]
  /** Custom UI element displayed on the right side (e.g., ✔ checkmark) */
  rightSlot?: React.ReactNode;
}

export type DropdownMenuProps = {
  /** Button or element that opens the menu */
  trigger: React.ReactElement
  /** Items array (supports nesting) */
  items: DropdownItem[]
  /** Optional label at top */
  label?: string
  /** Menu width (Tailwind class, e.g., "w-56") */
  widthClass?: string
  /** Additional class for the trigger element */
  triggerClassName?: string
  /** Default alignment */
  align?: "start" | "center" | "end"
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
}

/**
 * Example:
 * <DropdownMenu
 *   trigger={<Button variant="outline">Open</Button>}
 *   label="My Account"
 *   items={[
 *     { label: "Profile", shortcut: "⇧⌘P", onClick: () => alert("Profile") },
 *     { label: "Settings", shortcut: "⌘S" },
 *     { separatorBefore: true, label: "Log out", shortcut: "⇧⌘Q" },
 *   ]}
 * />
 */
export function DropdownMenu({
  trigger,
  items,
  label,
  widthClass = "w-56",
  triggerClassName = "",
  align = "start",
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const renderItems = (menuItems: DropdownItem[]) =>
    menuItems.map((item, index) => {
      if (item.separatorBefore) {
        return (
          <React.Fragment key={index}>
            <DropdownMenuSeparator />
            {renderItem(item, index)}
          </React.Fragment>
        )
      }
      return renderItem(item, index)
    })

  const renderItem = (item: DropdownItem, key: React.Key) => {
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={key}>
          <DropdownMenuSubTrigger disabled={item.disabled}>
            {item.label}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {renderItems(item.children)}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuItem
        key={key}
        disabled={item.disabled}
        onClick={item.onClick}
        className="flex items-center justify-between gap-2"
      >
        <span>{item.label}</span>

        {/* RIGHT SLOT (checkmark, icon, …) */}
        {item.rightSlot || null}

        {item.shortcut && (
          <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
        )}
      </DropdownMenuItem>
    )
  }


  return (
    <SDropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className={triggerClassName} asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn("p-1", widthClass, "rounded-md")}
      >
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        <DropdownMenuGroup>{renderItems(items)}</DropdownMenuGroup>
      </DropdownMenuContent>
    </SDropdownMenu>
  )
}
