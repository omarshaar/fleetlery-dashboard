"use client"

import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from "@/eano/design-system/shadcn/gnatt"

import { TrashIcon, PencilIcon } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/eano/design-system/shadcn/avatar"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/eano/design-system/shadcn/context-menu"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/eano/design-system/shadcn/dialog"

import { Button } from "@/eano/design-system/shadcn/button"
import { Input } from "@/eano/design-system/shadcn/input"
import { cn } from "@/eano/lib/utils"
import type { GanttBlockProps, GanttFeatureInput } from "./GanttBlock.types"

import { useMemo, useState } from "react"

/* --------------------------------------------------
   Group features by group.name and sort alphabetically
-------------------------------------------------- */
function useGroupedFeatures(features: GanttFeatureInput[]) {
  return useMemo(() => {
    const map = new Map<string, GanttFeatureInput[]>()

    for (const f of features) {
      const name = f.group?.name ?? "Ungrouped"
      if (!map.has(name)) map.set(name, [])
      map.get(name)!.push(f)
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [features])
}

export function GanttBlock({
  features,
  markers = [],
  groups = [],              // ← NEW
  range = "monthly",
  zoom = 100,
  className,

  onViewFeature,
  onRemoveFeature,
  onRemoveMarker,
  onCreateMarker,
  onAddFeature,
  onMoveFeature,
  onEditFeature,          // ← NEW
}: GanttBlockProps) {
  const groupedFeatures = useGroupedFeatures(features)

  const safeRange = (range ?? "monthly") as "daily" | "monthly" | "quarterly"

  /* ==================================================
      Rename Dialog State
  ================================================== */
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [renameGroupId, setRenameGroupId] = useState("")

  const openRenameDialog = (feature: GanttFeatureInput) => {
    setRenameId(feature.id)
    setRenameValue(feature.name)
    setRenameGroupId(feature.group.id)
    setRenameOpen(true)
  }

  /* ==================================================
      Handlers
  ================================================== */
  const handleMoveFeatureInternal = (
    id: string,
    startAt: Date,
    endAt: Date | null
  ) => {
    if (!endAt) return
    onMoveFeature?.(id, startAt, endAt)
  }

  const handleAddFeatureInternal = (date: Date) => onAddFeature?.(date)

  const handleRemoveMarkerInternal = (id: string) => onRemoveMarker?.(id)

  /* ==================================================
      MAIN UI
  ================================================== */
  return (
    <div className="layout-body-w h-full">
      {/* ==================== Provider ==================== */}
      <GanttProvider
        className={cn("border rounded-md", className)}
        range={safeRange}
        zoom={zoom}
        onAddItem={handleAddFeatureInternal}
      >
        {/* ==================== Sidebar ==================== */}
        <GanttSidebar>
          {groupedFeatures.map(([groupName, groupFeatures]) => (
            <GanttSidebarGroup key={groupName} name={groupName}>
              {groupFeatures.map(feature => (
                <GanttSidebarItem
                  key={feature.id}
                  feature={feature}
                  onSelectItem={onViewFeature}
                />
              ))}
            </GanttSidebarGroup>
          ))}
        </GanttSidebar>

        {/* ==================== Timeline ==================== */}
        <GanttTimeline>
          <GanttHeader />

          <GanttFeatureList>
            {groupedFeatures.map(([_, groupFeatures]) => (
              <GanttFeatureListGroup key={_}>
                {groupFeatures.map(feature => (
                  <div className="flex" key={feature.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <button
                          className="w-full text-left"
                          onClick={() => onViewFeature?.(feature.id)}
                        >
                          <GanttFeatureItem
                            {...feature}
                            onMove={handleMoveFeatureInternal}
                          >
                            <p className="flex-1 truncate text-xs">
                              {feature.name}
                            </p>

                            {feature.owner && (
                              <Avatar className="h-4 w-4">
                                {feature.owner.image && (
                                  <AvatarImage src={feature.owner.image} />
                                )}
                                <AvatarFallback>
                                  {feature.owner.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </GanttFeatureItem>
                        </button>
                      </ContextMenuTrigger>

                      {/* ==================== Right-click Menu ==================== */}
                      <ContextMenuContent>

                        {/* Edit */}
                        <ContextMenuItem
                          className="flex items-center gap-2"
                          onClick={() => openRenameDialog(feature)}
                        >
                          <PencilIcon size={16} />
                          Edit
                        </ContextMenuItem>

                        {/* DELETE */}
                        <ContextMenuItem
                          className="flex items-center gap-2 text-destructive"
                          onClick={() => onRemoveFeature?.(feature.id)}
                        >
                          <TrashIcon size={16} />
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                ))}
              </GanttFeatureListGroup>
            ))}
          </GanttFeatureList>

          {/* ==================== Markers ==================== */}
          {markers.map(marker => (
            <GanttMarker
              key={marker.id}
              {...marker}
              onRemove={
                onRemoveMarker ? () => handleRemoveMarkerInternal(marker.id) : undefined
              }
            />
          ))}

          <GanttToday />
          {onCreateMarker && (
            <GanttCreateMarkerTrigger onCreateMarker={onCreateMarker} />
          )}
        </GanttTimeline>
      </GanttProvider>

      {/* ==================================================
          RENAME DIALOG
      ================================================== */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Feature</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name Input */}
            <Input
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              placeholder="Enter new name..."
            />

            {/* Group Selector */}
            {groups?.length > 0 && (
              <select
                className="border rounded-md p-2 w-full bg-background"
                value={renameGroupId}
                onChange={e => setRenameGroupId(e.target.value)}
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                if (renameId && onEditFeature) {
                  onEditFeature(renameId, renameValue.trim(), renameGroupId)
                }
                setRenameOpen(false)
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

