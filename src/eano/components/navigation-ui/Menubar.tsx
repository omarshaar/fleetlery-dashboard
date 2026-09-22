import React from "react"
import {
  Menubar as SMenubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/eano/design-system/shadcn/menubar"
import { cn } from "@/eano/lib/utils"

/**
 * Unified Menubar component.
 * - One single import only.
 * - Uses a simple data structure for menus, items, checkboxes, radios, and submenus.
 */

export type MenubarItemType = {
  /** Visible label of the item */
  label: string
  /** Shortcut text (e.g. ⌘T) */
  shortcut?: string
  /** Disable this item */
  disabled?: boolean
  /** Add separator before this item */
  separatorBefore?: boolean
  /** Whether this is a checkbox item */
  checkbox?: boolean
  /** Checked state if checkbox */
  checked?: boolean
  /** Radio group name (if radio) */
  radioGroup?: string
  /** Radio item value */
  radioValue?: string
  /** Destructive variant */
  variant?: "default" | "destructive"
  /** Nested submenu items */
  children?: MenubarItemType[]
  /** Action handler */
  onClick?: () => void
}

export type MenubarMenuType = {
  /** Label of the top-level trigger */
  label: string
  /** Array of menu items */
  items: MenubarItemType[]
}

export type MenubarProps = {
  /** Array of menus */
  menus: MenubarMenuType[]
  /** Optional className */
  className?: string
}

/**
 * Example:
 * <Menubar
 *   menus={[
 *     {
 *       label: "File",
 *       items: [
 *         { label: "New Tab", shortcut: "⌘T" },
 *         { label: "New Window", shortcut: "⌘N" },
 *         { separatorBefore: true, label: "Print...", shortcut: "⌘P" },
 *       ],
 *     },
 *   ]}
 * />
 */
export function Menubar({ menus, className }: MenubarProps) {
  const renderItems = (items: MenubarItemType[]) =>
    items.map((item, i) => {
      if (item.separatorBefore) {
        return (
          <React.Fragment key={i}>
            <MenubarSeparator />
            {renderItem(item, i)}
          </React.Fragment>
        )
      }
      return renderItem(item, i)
    })

  const renderItem = (item: MenubarItemType, key: React.Key) => {
    // submenu
    if (item.children && item.children.length > 0) {
      // radio group
      const hasRadio = item.children.some((c) => c.radioGroup)
      if (hasRadio) {
        const selected = item.children.find((c) => c.checked)?.radioValue
        return (
          <MenubarRadioGroup key={key} value={selected}>
            {item.children.map((child, idx) => (
              <MenubarRadioItem
                key={idx}
                value={child.radioValue || ""}
                disabled={child.disabled}
              >
                {child.label}
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
        )
      }

      return (
        <MenubarSub key={key}>
          <MenubarSubTrigger>{item.label}</MenubarSubTrigger>
          <MenubarSubContent>{renderItems(item.children)}</MenubarSubContent>
        </MenubarSub>
      )
    }

    // checkbox
    if (item.checkbox) {
      return (
        <MenubarCheckboxItem key={key} checked={item.checked}>
          {item.label}
        </MenubarCheckboxItem>
      )
    }

    // normal item
    return (
      <MenubarItem
        key={key}
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(
          item.variant === "destructive" &&
            "text-destructive focus:bg-destructive/10"
        )}
      >
        {item.label}
        {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
      </MenubarItem>
    )
  }

  return (
    <SMenubar className={cn("rounded-md border bg-background", className)}>
      {menus.map((menu, idx) => (
        <MenubarMenu key={idx}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          <MenubarContent>{renderItems(menu.items)}</MenubarContent>
        </MenubarMenu>
      ))}
    </SMenubar>
  )
}
