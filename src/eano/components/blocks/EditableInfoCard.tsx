"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Input,
  Textarea,
  Select,
  DatePicker,
  TimePicker,
  ColorPicker,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Dialog,
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
  ImageZoom,
} from "@/components"
import { Edit, Save, X, Camera } from "lucide-react"
import { uid } from "@/eano/components/media-visual-ui/ProductImageGallery/utils"
import { cn } from "@/eano/lib/utils"

export interface EditableInfoField {
  key: string
  label: string
  value: any
  type?:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "image"
    | "select"
    | "date"
    | "time"
    | "color"
  editable?: boolean
  options?: { label: string; value: string }[]
  description?: string
  required?: boolean
  error?: string
}

interface EditableInfoCardStrings {
  changeImage?: string
  selectPlaceholder?: string
  pickColorTitle?: string
  pickColorDescription?: string
  uploadImageTitle?: string
  uploadImageDescription?: string
  imageFallback?: string
}

interface EditableInfoCardProps {
  title?: string
  fields: EditableInfoField[]
  editable?: boolean
  onSave?: (changed: Record<string, any>) => void
  strings?: EditableInfoCardStrings
  className?: string
}

function valuesFromFields(fields: EditableInfoField[]) {
  return fields.reduce((acc, f) => ({ ...acc, [f.key]: f.value }), {})
}

export function EditableInfoCard({
  title = "Information",
  fields,
  editable = true,
  onSave,
  strings,
  className,
  ...props
}: EditableInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  // For color picker dialogs
  const [colorDialog, setColorDialog] = useState<{ open: boolean; key: string | null }>({
    open: false,
    key: null,
  })

  // Temporary color (uncontrolled)
  const [tempColor, setTempColor] = useState<string | null>(null)

  const [internalValues, setInternalValues] = useState<Record<string, any>>(
    () => valuesFromFields(fields)
  )

  useEffect(() => {
    if (!isEditing) {
      setInternalValues(valuesFromFields(fields))
    }
  }, [fields, isEditing])

  const originalValues = useMemo<Record<string, any>>(
    () =>
      fields.reduce((acc: Record<string, any>, f) => {
        acc[f.key] = f.value
        return acc
      }, {}),
    [fields]
  )

  const handleChange = (key: string, val: any) => {
    setInternalValues((prev) => ({ ...prev, [key]: val }))
  }

  // =========================================
  // Normalizer for color preview only
  // =========================================
  const normalizeColor = (raw: any): string => {
    if (!raw) return "rgba(0,0,0,1)"

    if (typeof raw === "string" && raw.startsWith("#")) return raw

    if (typeof raw === "string" && raw.startsWith("rgba")) return raw

    if (typeof raw === "string" && raw.startsWith("rgb(")) {
      const [r, g, b] = raw
        .replace("rgb(", "")
        .replace(")", "")
        .split(",")
        .map((n) => Number(n) || 0)
      return `rgba(${r}, ${g}, ${b}, 1)`
    }

    if (typeof raw === "string" && raw.includes(",")) {
      const [r, g, b, a] = raw.split(",").map((n) => Number(n) || 0)
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a || 1})`
    }

    return "rgba(0,0,0,1)"
  }

  // ======================================
  //    IMAGE LOGIC
  // ======================================

  const avatarField = fields.find((f) => f.type === "image")
  const avatarSrc = avatarField
    ? internalValues[avatarField.key]?.src || internalValues[avatarField.key]
    : null

  const handleImageDrop = (files: File[]) => {
    if (!avatarField) return
    const file = files[0]
    if (!file) return

    const newItem = {
      id: uid(),
      src: URL.createObjectURL(file),
      file,
      status: "idle",
    }

    handleChange(avatarField.key, newItem)
    setImageDialogOpen(false)
  }

  // ======================================
  // SAVE / CANCEL
  // ======================================

  const handleCancel = () => {
    setInternalValues(originalValues)
    setIsEditing(false)
  }

  const handleSave = () => {
    const changed: Record<string, any> = {}

    for (const key in internalValues) {
      if (internalValues[key] !== originalValues[key]) {
        changed[key] = internalValues[key]
      }
    }

    onSave?.(changed)
    setIsEditing(false)
  }

  // ======================================
  //    VIEW VALUE
  // ======================================
  const renderViewValue = (field: EditableInfoField, val: any) => {
    if (val === null || val === undefined || val === "") return "—"

    switch (field.type) {
      case "color":
        const c = normalizeColor(val)
        return (
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border"
              style={{ background: c }}
            />
            {c}
          </span>
        )

      case "date":
        return val instanceof Date ? val.toLocaleDateString() : String(val)

      case "time":
        return String(val)

      case "select":
        const opt = field.options?.find((o) => o.value === val)
        return opt ? opt.label : val

      default:
        return typeof val === "object" ? JSON.stringify(val) : String(val)
    }
  }

  return (
    <Card className={cn("py-4!", avatarField && "gap-4!", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>

        {editable &&
          (!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" className="rounded-lg" onClick={handleSave}>
                <Save size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={handleCancel}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
      </CardHeader>

      <CardContent>
        {/* Avatar */}
        {avatarField && (
          <div className="flex flex-col gap-3 mb-8">
            {!isEditing ? (
              <ImageZoom>
                <Avatar className="h-24 w-24 rounded-full border shadow-sm">
                  <AvatarImage src={avatarSrc || undefined} />
                  <AvatarFallback>{strings?.imageFallback ?? "IMG"}</AvatarFallback>
                </Avatar>
              </ImageZoom>
            ) : (
              <Avatar className="h-24 w-24 rounded-full border shadow-sm opacity-80">
                <AvatarImage src={avatarSrc || undefined} />
                <AvatarFallback>{strings?.imageFallback ?? "IMG"}</AvatarFallback>
              </Avatar>
            )}

            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-max"
                onClick={() => setImageDialogOpen(true)}
              >
                <Camera size={16} />
                {strings?.changeImage ?? "Change"}
              </Button>
            )}
          </div>
        )}

        {/* OTHER FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields
            .filter((f) => f.type !== "image")
            .map((field) => {
              const value = internalValues[field.key]

              // VIEW MODE
              if (!isEditing) {
                return (
                  <div key={field.key}>
                    <p className="text-sm opacity-70">{field.label}</p>
                    <div className="mt-1">
                      {renderViewValue(field, value)}
                    </div>
                  </div>
                )
              }

              // EDIT MODE
              return (
                <div key={field.key}>
                  {(() => {
                    switch (field.type) {
                      case "textarea":
                        return (
                          <Textarea
                            label={field.label}
                            description={field.description}
                            required={field.required}
                            error={field.error}
                            disabled={field.editable === false}
                            value={value}
                            onChange={(e) =>
                              handleChange(field.key, e.target.value)
                            }
                          />
                        )

                      case "select":
                        return (
                          <Select
                            label={field.label}
                            description={field.description}
                            required={field.required}
                            disabled={field.editable === false}
                            error={field.error}
                            value={value}
                            onChange={(v) => handleChange(field.key, v)}
                            options={field.options || []}
                            placeholder={strings?.selectPlaceholder ?? "Select..."}
                          />
                        )

                      case "date":
                        return (
                          <DatePicker
                            label={field.label}
                            description={field.description}
                            required={field.required}
                            disabled={field.editable === false}
                            value={value}
                            onChange={(v) =>
                              handleChange(field.key, v)
                            }
                          />
                        )

                      case "time":
                        return (
                          <TimePicker
                            label={field.label}
                            description={field.description}
                            required={field.required}
                            disabled={field.editable === false}
                            value={value}
                            onChange={(v) =>
                              handleChange(field.key, v)
                            }
                          />
                        )

                      // ================================
                      //    COLOR FIELD WITH DIALOG
                      // ================================
                      case "color":
                        return (
                          <div className="flex flex-col gap-2">
                            <p className="text-sm opacity-70">{field.label}</p>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-max flex items-center gap-2"
                              onClick={() =>
                                setColorDialog({ open: true, key: field.key })
                              }
                            >
                              <span
                                className="w-4 h-4 rounded-full border"
                                style={{ background: normalizeColor(value) }}
                              />
                              {normalizeColor(value)}
                            </Button>

                            <Dialog
                              open={
                                colorDialog.open &&
                                colorDialog.key === field.key
                              }
                              onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                  if (tempColor !== null) {
                                    handleChange(field.key, tempColor)
                                    setTempColor(null)
                                  }
                                }

                                setColorDialog({
                                  open: isOpen,
                                  key: field.key,
                                })
                              }}
                                title={strings?.pickColorTitle ?? "Pick a Color"}
                              description={
                                strings?.pickColorDescription ??
                                "Select a new color."
                              }
                              size="sm"
                              trigger={null}
                            >
                              <div className="p-3">
                                <ColorPicker
                                  defaultValue={normalizeColor(value)}
                                  onChange={(v) => setTempColor(v)}
                                />
                              </div>
                            </Dialog>
                          </div>
                        )

                      default:
                        return (
                          <Input
                            label={field.label}
                            description={field.description}
                            required={field.required}
                            error={field.error}
                            disabled={field.editable === false}
                            type={field.type || "text"}
                            value={value}
                            onChange={(e) =>
                              handleChange(field.key, e.target.value)
                            }
                          />
                        )
                    }
                  })()}
                </div>
              )
            })}
        </div>
      </CardContent>

      {/* Image Dialog */}
      {avatarField && (
        <Dialog
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          title={strings?.uploadImageTitle ?? "Upload Profile Photo"}
          description={
            strings?.uploadImageDescription ??
            "Drag & drop or select a new profile photo."
          }
          size="lg"
          trigger={null}
        >
          <Dropzone
            accept={{ "image/*": [] }}
            multiple={false}
            onDrop={handleImageDrop}
          >
            <DropzoneEmptyState className="py-9" />
            <DropzoneContent />
          </Dropzone>
        </Dialog>
      )}
    </Card>
  )
}
