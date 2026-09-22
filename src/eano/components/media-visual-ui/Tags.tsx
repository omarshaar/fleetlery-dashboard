"use client"

import * as React from "react"
import {
  Tags as ShadcnTags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/eano/design-system/shadcn/tags"
import { CheckIcon } from "lucide-react"
import { FieldWrapper } from "@/eano/components/_shared/FieldWrapper"
import type { BaseFieldProps } from "@/eano/components/_shared/field-types"
import { cn } from "@/eano/lib/utils"

/**
 * Tags – unified wrapper for Shadcn Tags component
 * ------------------------------------------------------------
 * - Single entry point with unified API (label, error, description, etc.)
 * - Handles selection, removal, and search internally.
 * - Supports controlled/uncontrolled usage.
 * - Preserves full original layout (Trigger, Input, List, Group).
 */

export type TagOption = {
  id: string
  label: string
}

type TagsProps = BaseFieldProps &
  (
    | {
        /** Controlled mode */
        value: string[]
        onChange: (values: string[]) => void
        defaultValue?: never
      }
    | {
        /** Uncontrolled mode */
        defaultValue?: string[]
        onChange?: (values: string[]) => void
        value?: never
      }
  ) & {
    /** List of available tags */
    options: TagOption[]
    /** Placeholder text for input */
    placeholder?: string
  }

export function Tags({
  label,
  description,
  error,
  required,
  disabled,
  className,
  id: providedId,
  options,
  placeholder = "Search tag...",
  ...rest
}: TagsProps) {
  const reactId = React.useId()
  const id = providedId ?? `tags-${reactId}`
  const describedById = `${id}-desc`

  const isControlled = "value" in rest
  const [internal, setInternal] = React.useState<string[]>(rest.defaultValue ?? [])
  const value: string[] = isControlled ? (rest as { value: string[] }).value : internal

  const setValue = (next: string[]) => {
    if (!isControlled) setInternal(next)
    rest.onChange?.(next)
  }

  const handleSelect = (tagId: string) => {
    if (value.includes(tagId)) {
      setValue(value.filter((v) => v !== tagId))
    } else {
      setValue([...value, tagId])
    }
  }

  const handleRemove = (tagId: string) => {
    setValue(value.filter((v) => v !== tagId))
  }

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <div
        className={cn(
          "max-w-[300px]",
          disabled && "opacity-60 pointer-events-none cursor-not-allowed"
        )}
      >
        <ShadcnTags aria-describedby={describedById}>
          {/* Selected tags */}
          <TagsTrigger>
            {value.length > 0 ? (
              value.map((tag: string) => (
                <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
                  {(options.find((o: TagOption) => o.id === tag)?.label ?? tag) as string}
                </TagsValue>
              ))
            ) : (
              <TagsValue className="text-muted-foreground">No tags selected</TagsValue>
            )}
          </TagsTrigger>

          {/* Tag list */}
          <TagsContent>
            <TagsInput placeholder={placeholder} />
            <TagsList>
              <TagsEmpty />
              <TagsGroup>
                {options.map((opt) => (
                  <TagsItem
                    key={opt.id}
                    value={opt.id}
                    onSelect={() => handleSelect(opt.id)}
                  >
                    {opt.label}
                    {value.includes(opt.id) && (
                      <CheckIcon className="ml-1 text-muted-foreground" size={14} />
                    )}
                  </TagsItem>
                ))}
              </TagsGroup>
            </TagsList>
          </TagsContent>
        </ShadcnTags>
      </div>
    </FieldWrapper>
  )
}
