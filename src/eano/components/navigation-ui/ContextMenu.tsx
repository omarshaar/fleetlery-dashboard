import React from "react"
import {
  ContextMenu as SContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuShortcut,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "@/eano/design-system/shadcn/context-menu"
import { cn } from "@/eano/lib/utils"

/**
 * Unified ContextMenu component.
 * - Single component usage (no subimports).
 * - Data-driven API.
 * - Supports nested menus, checkboxes, and radio groups.
 */

export type ContextMenuItemType = {
  /** Text inside the menu item */
  label: string
  /** Optional keyboard shortcut */
  shortcut?: string
  /** Optional click handler */
  onClick?: () => void
  /** Disabled state */
  disabled?: boolean
  /** Add separator before item */
  separatorBefore?: boolean
  /** Checkbox support */
  checked?: boolean
  /** Radio group name and value */
  radioGroup?: string
  radioValue?: string
  /** Submenu items */
  children?: ContextMenuItemType[]
  /** Destructive or normal variant */
  variant?: "default" | "destructive"
}

export type ContextMenuProps = {
  /** Trigger element (the right-click target) */
  trigger: React.ReactElement
  /** Array of items (supports nesting) */
  items: ContextMenuItemType[]
  /** Menu width */
  widthClass?: string
}

/**
 * Example:
 * <ContextMenu
 *   trigger={<div className="border w-64 h-32 flex items-center justify-center rounded-md">Right click</div>}
 *   items={[
 *     { label: "Back", shortcut: "⌘[", onClick: () => alert("Back") },
 *     { label: "Reload", shortcut: "⌘R" },
 *     {
 *       label: "More Tools",
 *       children: [
 *         { label: "Save Page..." },
 *         { label: "Developer Tools" },
 *         { separatorBefore: true, label: "Delete", variant: "destructive" },
 *       ],
 *     },
 *     { separatorBefore: true, label: "Show Bookmarks", checked: true },
 *     { label: "Show Full URLs" },
 *     {
 *       separatorBefore: true,
 *       label: "People",
 *       children: [
 *         { label: "Pedro Duarte", radioGroup: "people", radioValue: "pedro" },
 *         { label: "Colm Tuite", radioGroup: "people", radioValue: "colm" },
 *       ],
 *     },
 *   ]}
 * />
 */
export function ContextMenu({
  trigger,
  items,
  widthClass = "w-52",
}: ContextMenuProps) {
  const renderItems = (menuItems: ContextMenuItemType[]) =>
    menuItems.map((item, i) => {
      if (item.separatorBefore) {
        return (
          <React.Fragment key={i}>
            <ContextMenuSeparator />
            {renderItem(item, i)}
          </React.Fragment>
        )
      }
      return renderItem(item, i)
    })

  const renderItem = (item: ContextMenuItemType, key: React.Key) => {
    // Submenu
    if (item.children && item.children.length > 0) {
      // Radio group
      const hasRadio = item.children.some((c) => c.radioGroup)
      if (hasRadio) {
        const value = item.children.find((c) => c.checked)?.radioValue
        return (
          <ContextMenuRadioGroup key={key} value={value}>
            <ContextMenuLabel inset>{item.label}</ContextMenuLabel>
            {item.children.map((child, i) => (
              <ContextMenuRadioItem
                key={i}
                value={child.radioValue || ""}
                disabled={child.disabled}
              >
                {child.label}
              </ContextMenuRadioItem>
            ))}
          </ContextMenuRadioGroup>
        )
      }

      return (
        <ContextMenuSub key={key}>
          <ContextMenuSubTrigger inset>{item.label}</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            {renderItems(item.children)}
          </ContextMenuSubContent>
        </ContextMenuSub>
      )
    }

    // Checkbox
    if (item.checked !== undefined) {
      return (
        <ContextMenuCheckboxItem key={key} checked={item.checked}>
          {item.label}
        </ContextMenuCheckboxItem>
      )
    }

    // Normal or destructive item
    return (
      <ContextMenuItem
        key={key}
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(
          item.variant === "destructive" && "text-destructive focus:bg-destructive/10"
        )}
      >
        {item.label}
        {item.shortcut && (
          <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
        )}
      </ContextMenuItem>
    )
  }

  return (
    <SContextMenu>
      <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
      <ContextMenuContent className={cn("rounded-md", widthClass)}>
        {renderItems(items)}
      </ContextMenuContent>
    </SContextMenu>
  )
}
