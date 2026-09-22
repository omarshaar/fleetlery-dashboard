// GanttBlock.types.ts

/* --------------------------------------------------
   🔹 Status of a feature (e.g., Planned / In Progress)
-------------------------------------------------- */
export type GanttStatus = {
  id: string
  name: string
  color: string // e.g. "#6B7280"
}

/* --------------------------------------------------
   🔹 User / Owner assigned to a feature
-------------------------------------------------- */
export type GanttUser = {
  id: string
  name: string
  image?: string | null
}

/* --------------------------------------------------
   🔹 Generic reference object used for grouping
      (e.g., Group, Product, Initiative, Release)
-------------------------------------------------- */
export type GanttRefObject = {
  id: string
  name: string
}

/* --------------------------------------------------
   🔹 Gantt Feature Input (single task / bar)
      This is the MAIN entity inside the Gantt timeline.
-------------------------------------------------- */
export type GanttFeatureInput = {
  id: string
  name: string
  startAt: Date
  endAt: Date

  status: GanttStatus // REQUIRED
  owner?: GanttUser | null

  // grouping
  group: GanttRefObject // REQUIRED

  // optional higher-level references
  product?: GanttRefObject | null
  initiative?: GanttRefObject | null
  release?: GanttRefObject | null
}

/* --------------------------------------------------
   🔹 Gantt Marker Input
-------------------------------------------------- */
export type GanttMarkerInput = {
  id: string
  date: Date
  label: string
  className?: string
}

/* --------------------------------------------------
   🔹 Props for GanttBlock Component
-------------------------------------------------- */
export type GanttBlockProps = {
  features: GanttFeatureInput[]
  markers?: GanttMarkerInput[]

  range?: "daily" | "monthly" | "quarterly"
  zoom?: number
  className?: string

  groups?: GanttRefObject[]

  onViewFeature?: (id: string) => void
  onCopyLink?: (id: string) => void
  onRemoveFeature?: (id: string) => void

  // NOW: rename + optionally move to new group
  onEditFeature?: (
    id: string,
    newName: string,
    newGroupId?: string
  ) => void

  onChangeGroup?: (id: string, groupId: string) => void
  onChangeStatus?: (id: string, statusId: string) => void
  onChangeOwner?: (id: string, userId: string | null) => void

  onRemoveMarker?: (id: string) => void
  onCreateMarker?: (date: Date) => void
  onAddFeature?: (date: Date) => void
  onMoveFeature?: (id: string, startAt: Date, endAt: Date) => void
}

