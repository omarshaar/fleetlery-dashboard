"use client"

/**
 * @file EanoRichTextEditor.tsx
 * @description Unified and reusable rich text editor component built on top of SunEditor.
 * Supports dark mode (system) via @eano/hooks, full toolbar options, and iframe style injection.
 */

import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  useRef,
} from "react"
import SunEditor from "suneditor-react"
import "suneditor/dist/css/suneditor.min.css"
import type { SunEditorOptions } from "suneditor/src/options"
import type SunEditorCore from "suneditor/src/lib/core"
import { cn } from "@/eano/lib/utils"
import { useSystemTheme } from "@/eano/hooks"

// ======================================================
// 🔹 Types
// ======================================================
export interface EanoRichTextEditorProps {
  label?: string
  description?: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
  height?: string
  options?: SunEditorOptions
  onInit?: (editor: SunEditorCore) => void
}

// ======================================================
// 🔹 Default Toolbar Options
// ======================================================
const DEFAULT_OPTIONS: SunEditorOptions = {
  mode: "classic",
  rtl: false,
  imageFileInput: true,
  videoFileInput: false,
  resizingBar: true,
  showPathLabel: false,
  charCounter: true,
  buttonList: [
    ["undo", "redo"],
    ["bold", "italic", "underline", "strike"],
    ["fontColor", "hiliteColor", "removeFormat"],
    ["align", "list", "table"],
    ["link", "image", "codeView"],
    ["fullScreen", "preview"],
  ],
}

// ======================================================
// 🔹 Component
// ======================================================
export const EanoRichTextEditor = forwardRef<
  SunEditorCore,
  EanoRichTextEditorProps
>(
  (
    {
      label,
      description,
      name,
      value = "",
      onChange,
      placeholder = "Start typing...",
      disabled,
      error,
      className,
      height = "300px",
      options,
      onInit,
    },
    ref
  ) => {
    const [editorInstance, setEditorInstance] = useState<SunEditorCore | null>(
      null
    )
    const isDark = useSystemTheme()

    // Prevent hydration-triggered updates
    const valueSetRef = useRef(false)

    // Imperative handle (expose instance)
    useImperativeHandle(ref, () => editorInstance as SunEditorCore, [
      editorInstance,
    ])

    // ======================================================
    // 🔹 onChange handler
    // ======================================================
    const handleChange = (val: string) => {
      onChange?.(val)
    }

    // ======================================================
    // 🔹 Inject Dark/Light mode styles inside the iframe
    // ======================================================
    const applyModeStyles = useCallback(() => {
      if (!editorInstance) return

      const iframe = editorInstance.core.context.element
        .wysiwygFrame as HTMLIFrameElement
      const iframeDocument =
        iframe?.contentDocument || iframe?.contentWindow?.document
      if (!iframeDocument) return

      const existing = iframeDocument.getElementById("eano-darkmode-style")
      if (existing) existing.remove()

      const style = iframeDocument.createElement("style")
      style.id = "eano-darkmode-style"

      style.innerHTML = `
        body {
          background-color: var(--background) !important;
          color: var(--foreground) !important;
        }
        table, td, th {
          border-color: var(--border) !important;
        }
        a {
          color: var(--primary) !important;
        }
      `

      iframeDocument.head.appendChild(style)
    }, [editorInstance, isDark])

    useEffect(() => {
      applyModeStyles()
    }, [applyModeStyles, isDark])

    // ======================================================
    // 🔹 Sync external value WITHOUT triggering onChange
    // ======================================================
    useEffect(() => {
      if (!editorInstance) return

      if (!valueSetRef.current) {
        editorInstance.setContents(value || "")
        valueSetRef.current = true
      }
    }, [editorInstance, value])

    // ======================================================
    // 🔹 Handle SunEditor initialization
    // ======================================================
    const handleInit = (editor: SunEditorCore) => {
      setEditorInstance(editor)
      applyModeStyles()
      onInit?.(editor)
    }

    // ======================================================
    // 🔹 Dynamic Options (merge defaults)
    // ======================================================
    const dynamicOptions: SunEditorOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      defaultStyle: `
        font-family: system-ui, sans-serif;
        font-size: 15px;
        line-height: 1.6;
        background-color: var(--background);
        color: var(--foreground);
      `,
    }

    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "border rounded-lg overflow-hidden bg-background shadow-sm suneditor-container",
            disabled && "opacity-70 pointer-events-none",
            error && "border-destructive"
          )}
        >
          <SunEditor
            name={name}
            defaultValue={value}
            onBlur={(_event, editorContents) => handleChange(editorContents)}
            placeholder={placeholder}
            disable={disabled}
            height={height}
            setOptions={dynamicOptions}
            getSunEditorInstance={handleInit}
          />
        </div>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

EanoRichTextEditor.displayName = "EanoRichTextEditor"
