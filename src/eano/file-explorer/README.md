# File Explorer Component - Usage Guide

**Purpose**: Comprehensive documentation for AI tools and developers to understand and implement the File Explorer component.

---

## Table of Contents

1. [Component Overview](#component-overview)
2. [Core Concepts](#core-concepts)
3. [Data Types & Interfaces](#data-types--interfaces)
4. [Component Props API](#component-props-api)
5. [State Management](#state-management)
6. [Event Callbacks](#event-callbacks)
7. [LocalStorage Persistence](#localstorage-persistence)
8. [Implementation Examples](#implementation-examples)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## Component Overview

### What is FileBrowserBlock?

`FileBrowserBlock` is a React component that provides a complete file exploration interface with:
- **Grid and List view modes** - Switch between visual styles
- **File sorting** - Sort by name, type, size, date, extension
- **Multi-selection** - Select multiple files/folders with callbacks
- **Navigation** - Navigate through folder hierarchy
- **File preview** - Modal viewer for supported file types
- **Drag & Drop** - Move files between folders
- **Persistent settings** - Saves user preferences to localStorage
- **Event system** - Comprehensive callbacks for all interactions

### File Location

```
src/eano/file-explorer/FileBrowserBlock.tsx
```

### Import Statement

```typescript
import FileBrowserBlock from "@/eano/file-explorer/FileBrowserBlock";
import type { FileItem } from "@/eano/file-explorer/types/file-item";
```

---

## Core Concepts

### 1. FileItem Object Structure

Every item (file or folder) is represented as a `FileItem`:

```typescript
interface FileItem {
  id: string;              // Unique identifier (UUID, numeric ID, etc.)
  name: string;            // Display name shown in UI
  type: FileItemType;      // Type classification (folder, image, pdf, video, etc.)
  path?: string;           // Optional: full path in file system
  url?: string;            // Optional: URL to access file content
  sizeBytes?: number;      // Optional: file size in bytes
  createdAt?: Date;        // Optional: creation timestamp
  updatedAt?: Date;        // Optional: last modified timestamp
  extension?: string;      // Optional: file extension (e.g., "pdf", "jpg")
}
```

### 2. Supported File Types

```
FileItemType = 
  "folder"     // Directory/folder
  "image"      // JPG, PNG, WebP, SVG, etc.
  "pdf"        // PDF documents
  "video"      // MP4, WebM, etc.
  "audio"      // MP3, WAV, etc.
  "text"       // Plain text files
  "code"       // Source code files
  "document"   // Word, Excel, etc.
  "archive"    // ZIP, RAR, etc.
  "other"      // Unknown/unsupported types
```

### 3. View Modes

```typescript
type FileViewMode = "grid" | "list"

// Grid: Large tile-based view (like Windows 11)
// List: Compact row-based view with more details
```

### 4. Sorting Capabilities

```typescript
type FileSortField = "name" | "type" | "sizeBytes" | "createdAt" | "updatedAt" | "extension"
type FileSortDirection = "asc" | "desc"
```

---

## Data Types & Interfaces

### FileItem (Complete)

```typescript
interface FileItem {
  // Required fields
  id: string;
  name: string;
  type: FileItemType;
  
  // Optional fields
  path?: string;           // Example: "/products/2024/"
  url?: string;            // Example: "https://cdn.example.com/file.jpg"
  sizeBytes?: number;      // File size in bytes
  createdAt?: Date;        // Creation timestamp
  updatedAt?: Date;        // Last modified timestamp
  extension?: string;      // File extension without dot (e.g., "pdf")
  
  // Optional custom metadata
  [key: string]: any;      // Allows additional custom properties
}
```

### FileViewMode

```typescript
type FileViewMode = "grid" | "list"

/**
 * - "grid": Large tiles, icon-based, visual layout
 * - "list": Compact rows, detailed information (name, type, size, date)
 */
```

### FileSortField & FileSortDirection

```typescript
type FileSortField = 
  | "name"       // Sort alphabetically by file name
  | "type"       // Sort by file type (folder, image, pdf, etc.)
  | "sizeBytes"  // Sort by file size
  | "createdAt"  // Sort by creation date
  | "updatedAt"  // Sort by modification date
  | "extension"  // Sort by file extension

type FileSortDirection = "asc" | "desc"
```

---

## Component Props API

### Essential Props (Required & Common)

#### `items: FileItem[]`

**Required.** Array of files/folders to display.

```typescript
const files: FileItem[] = [
  { id: "1", name: "Documents", type: "folder" },
  {
    id: "2",
    name: "report.pdf",
    type: "pdf",
    sizeBytes: 512000,
    createdAt: new Date("2024-01-15"),
    url: "/files/report.pdf"
  },
  {
    id: "3",
    name: "photo.jpg",
    type: "image",
    url: "https://cdn.example.com/photo.jpg",
    sizeBytes: 204800
  }
];

<FileBrowserBlock items={files} />
```

### View Mode Props

#### `defaultViewMode?: FileViewMode`

Default view style. Defaults to `"grid"`.

```typescript
<FileBrowserBlock
  items={files}
  defaultViewMode="list"  // Start in list view
/>
```

#### `viewMode?: FileViewMode`

Controlled view mode. Makes component controlled.

```typescript
const [view, setView] = useState<FileViewMode>("grid");

<FileBrowserBlock
  items={files}
  viewMode={view}  // Component becomes controlled
  onViewModeChange={setView}
/>
```

#### `onViewModeChange?: (mode: FileViewMode) => void`

Fired when user changes view mode.

```typescript
<FileBrowserBlock
  items={files}
  onViewModeChange={(mode) => {
    console.log("User switched to:", mode); // "grid" or "list"
  }}
/>
```

#### `onListTypeChange?: (view: FileViewMode) => void`

Fired when view changes (for persisting preferences).

```typescript
<FileBrowserBlock
  items={files}
  onListTypeChange={(view) => {
    // Save to backend
    saveUserPreference("view", view);
  }}
/>
```

### Path Navigation Props

#### `currentPath?: string`

Current navigation path. Example: `"/documents/2024"`.

```typescript
const [path, setPath] = useState("/");

<FileBrowserBlock
  items={files}
  currentPath={path}
  onPathChange={setPath}
/>
```

#### `defaultPath?: string`

Default starting path. Defaults to `"/"`.

```typescript
<FileBrowserBlock items={files} defaultPath="/documents" />
```

#### `onPathChange?: (newPath: string) => void`

Fired when user navigates into a folder.

```typescript
<FileBrowserBlock
  items={files}
  onPathChange={(path) => {
    console.log("Navigated to:", path);
    // Load files from new directory
    fetchFilesForPath(path);
  }}
/>
```

### Item Interaction Props

#### `onItemClick?: (item: FileItem) => void`

Fired on single-click.

```typescript
<FileBrowserBlock
  items={files}
  onItemClick={(item) => {
    console.log("Clicked:", item.name);
  }}
/>
```

#### `onItemOpen?: (item: FileItem) => void`

Fired on double-click or "open" action.

```typescript
<FileBrowserBlock
  items={files}
  onItemOpen={(item) => {
    if (item.type === "folder") {
      // Navigate to folder (handled automatically)
    } else {
      // File preview modal opens (handled automatically)
    }
  }}
/>
```

#### `onItemRightClick?: (item: FileItem, event: React.MouseEvent) => void`

Fired on right-click. Use for context menus.

```typescript
<FileBrowserBlock
  items={files}
  onItemRightClick={(item, event) => {
    event.preventDefault();
    showContextMenu({
      x: event.clientX,
      y: event.clientY,
      file: item
    });
  }}
/>
```

### Selection Props

#### `onSelectionChange?: (selectedItems: FileItem[]) => void`

Fired when selection changes. Returns full selected items array.

```typescript
<FileBrowserBlock
  items={files}
  onSelectionChange={(selected) => {
    console.log("Selected files:", selected);
    console.log("Count:", selected.length);
    // Enable bulk operations
    setSelectedCount(selected.length);
  }}
/>
```

### File Move / Drag & Drop Props

#### `onFileMove?: (payload: { items: FileItem[]; targetFolder: FileItem }) => void`

Fired when files are dragged to a folder.

```typescript
<FileBrowserBlock
  items={files}
  onFileMove={(payload) => {
    console.log("Moving files:", payload.items.map(f => f.name));
    console.log("To folder:", payload.targetFolder.name);
    
    // Update backend
    moveFilesAPI({
      fileIds: payload.items.map(f => f.id),
      targetFolderId: payload.targetFolder.id
    });
  }}
/>
```

### Sorting Props

#### `onSortingChange?: (payload: { field: FileSortField; direction: FileSortDirection }) => void`

Fired when user changes sort in toolbar.

```typescript
<FileBrowserBlock
  items={files}
  onSortingChange={(payload) => {
    console.log("Sort by:", payload.field, payload.direction);
    // Persist user preference
    saveSortPreference(payload);
  }}
/>
```

#### `defaultSort?: FileSortField`

Default sort field (used if no localStorage value exists).

```typescript
<FileBrowserBlock items={files} defaultSort="name" />
```

#### `defaultSortDirection?: FileSortDirection`

Default sort direction.

```typescript
<FileBrowserBlock
  items={files}
  defaultSort="createdAt"
  defaultSortDirection="desc"
/>
```

### UI Props

#### `showToolbar?: boolean`

Show/hide the toolbar (view switcher, sort controls). Defaults to `true`.

```typescript
<FileBrowserBlock items={files} showToolbar={true} />
```

#### `defaultViewType?: FileViewMode`

Alternative name for defaultViewMode (for flexibility).

```typescript
<FileBrowserBlock items={files} defaultViewType="list" />
```

#### `className?: string`

Custom CSS class for container.

```typescript
<FileBrowserBlock
  items={files}
  className="border rounded-lg h-96"
/>
```

---

## State Management

### Internal State (Zustand Store)

The component uses Zustand for state management:

```typescript
// View mode state
const viewMode = useViewMode();        // Current view: "grid" | "list"
const setViewMode = useSetViewMode();  // Update view mode

// Path navigation state
const currentPath = useCurrentPath();   // Current path string
const setPath = useSetPath();           // Update path

// Preview state
const activePreviewItem = useActivePreviewItem();
const openPreview = useOpenPreview();   // Open preview modal
const closePreview = useClosePreview(); // Close preview modal

// Selection state
const selectedIds = useSelectedItems(); // Array of selected item IDs
```

### LocalStorage Keys

The component automatically persists state:

```typescript
// View mode persistence
localStorage.getItem("eano:file-explorer:view")
// Stores: "grid" or "list"

// Sorting persistence
localStorage.getItem("eano:file-explorer:sort")
// Stores: { field: "name", direction: "asc" }
```

---

## Event Callbacks

### Event Firing Order (For Understanding Flow)

```
User Action → Callback Fired → State Updated → Re-render

Examples:

1. Click on file:
   onItemClick(item) → [selection state updates] → re-render

2. Double-click on file:
   onItemOpen(item) → [preview modal opens] → re-render

3. Navigate into folder:
   onPathChange(newPath) → [path state updates] → re-render

4. Change view mode:
   onViewModeChange(mode) → onListTypeChange(mode) → localStorage updated → re-render

5. Change sort:
   onSortingChange({ field, direction }) → localStorage updated → items re-sorted → re-render

6. Drag files to folder:
   onFileMove({ items, targetFolder }) → [your backend update] → state updates → re-render
```

### Callback Response Handling

```typescript
// Callbacks are fired BEFORE component updates
// You can use them to:
// 1. Log/track user actions
// 2. Update parent state
// 3. Persist to backend
// 4. Trigger UI changes

const handleSortingChange = (payload) => {
  // Called when user clicks sort button in toolbar
  console.log(payload);
  
  // Optionally update parent state
  setSortPreference(payload);
  
  // Component automatically updates display
  // No need to manually update items array
};
```

---

## LocalStorage Persistence

### Automatic Persistence

The component automatically saves these preferences:

```typescript
// 1. View Mode (grid/list)
localStorage.getItem("eano:file-explorer:view")
// Returns: "grid" or "list"

// 2. Sort Settings
localStorage.getItem("eano:file-explorer:sort")
// Returns: { "field": "name", "direction": "asc" }
```

### Priority Order (For Initialization)

When component mounts:

```
1. Check external props (viewMode, currentPath)
   ↓ (if provided, use them)
   
2. Check localStorage values
   ↓ (if exist, restore them)
   
3. Use defaults (defaultViewMode, defaultPath, defaultSort)
   ↓ (fallback values)
```

### Clearing Preferences

```typescript
// Clear view mode
localStorage.removeItem("eano:file-explorer:view");

// Clear sorting
localStorage.removeItem("eano:file-explorer:sort");

// Clear all
localStorage.removeItem("eano:file-explorer:view");
localStorage.removeItem("eano:file-explorer:sort");
```

---

## Implementation Examples

### 1. Basic Usage (Minimal)

```typescript
import FileBrowserBlock from "@/eano/file-explorer/FileBrowserBlock";
import type { FileItem } from "@/eano/file-explorer/types/file-item";

export default function MyPage() {
  const files: FileItem[] = [
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "file.pdf", type: "pdf", sizeBytes: 512000 }
  ];

  return <FileBrowserBlock items={files} />;
}
```

### 2. Full Featured Implementation

```typescript
"use client";

import { useState } from "react";
import FileBrowserBlock from "@/eano/file-explorer/FileBrowserBlock";
import type { FileItem } from "@/eano/file-explorer/types/file-item";
import type { FileViewMode } from "@/eano/file-explorer/types/view-mode";
import type {
  FileSortField,
  FileSortDirection,
} from "@/eano/file-explorer/types/sort-types";

export default function DocumentBrowser() {
  // Local state
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "2024", type: "folder" },
    { id: "2", name: "2023", type: "folder" },
    { id: "3", name: "annual-report.pdf", type: "pdf", sizeBytes: 2048000 },
    { id: "4", name: "logo.png", type: "image", url: "/images/logo.png" }
  ]);

  const [path, setPath] = useState("/documents");

  // Event handlers
  const handleItemOpen = (item: FileItem) => {
    if (item.type === "folder") {
      setPath(`${path}/${item.name}`);
    } else {
      window.open(item.url, "_blank");
    }
  };

  const handlePathChange = (newPath: string) => {
    setPath(newPath);
    // Fetch new files from backend
    fetchFilesForPath(newPath);
  };

  const handleSelectionChange = (selected: FileItem[]) => {
    console.log("Selected:", selected.map(f => f.name));
    // Enable bulk delete, move, etc.
  };

  const handleFileMove = (payload) => {
    moveFilesAPI({
      fileIds: payload.items.map(f => f.id),
      targetFolderId: payload.targetFolder.id
    });
  };

  const handleSortingChange = (payload) => {
    // Save preference to backend
    saveUserPreference("fileSortField", payload.field);
    saveUserPreference("fileSortDirection", payload.direction);
  };

  return (
    <div className="p-4">
      <h1>Document Browser</h1>
      <FileBrowserBlock
        items={files}
        currentPath={path}
        onPathChange={handlePathChange}
        onItemOpen={handleItemOpen}
        onSelectionChange={handleSelectionChange}
        onFileMove={handleFileMove}
        onSortingChange={handleSortingChange}
        showToolbar={true}
        defaultSort="name"
        defaultSortDirection="asc"
        defaultViewType="list"
        className="border rounded-lg h-screen"
      />
    </div>
  );
}

// Helper functions
async function fetchFilesForPath(path: string) {
  const response = await fetch(`/api/files?path=${path}`);
  return response.json();
}

async function moveFilesAPI(payload) {
  return fetch("/api/files/move", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function saveUserPreference(key: string, value: any) {
  // Save to backend
  fetch("/api/user-preferences", {
    method: "POST",
    body: JSON.stringify({ key, value })
  });
}
```

### 3. Controlled vs Uncontrolled

```typescript
// UNCONTROLLED: Component manages its own state
<FileBrowserBlock
  items={files}
  defaultViewMode="grid"
  defaultPath="/"
/>

// CONTROLLED: Parent manages state
const [viewMode, setViewMode] = useState<FileViewMode>("grid");
const [currentPath, setCurrentPath] = useState("/");

<FileBrowserBlock
  items={files}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  currentPath={currentPath}
  onPathChange={setCurrentPath}
/>
```

### 4. With Context Menu

```typescript
const [contextMenu, setContextMenu] = useState(null);

<FileBrowserBlock
  items={files}
  onItemRightClick={(item, event) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      item
    });
  }}
/>

{contextMenu && (
  <ContextMenu
    x={contextMenu.x}
    y={contextMenu.y}
    options={[
      { label: "Delete", onClick: () => deleteFile(contextMenu.item) },
      { label: "Rename", onClick: () => renameFile(contextMenu.item) },
      { label: "Share", onClick: () => shareFile(contextMenu.item) }
    ]}
  />
)}
```

---

## Common Patterns

### Pattern 1: Lazy Load Files on Navigation

```typescript
const [files, setFiles] = useState<FileItem[]>([]);
const [loading, setLoading] = useState(false);

const handlePathChange = async (newPath: string) => {
  setLoading(true);
  try {
    const response = await fetch(`/api/files?path=${newPath}`);
    const newFiles = await response.json();
    setFiles(newFiles);
  } finally {
    setLoading(false);
  }
};

return (
  <>
    {loading && <LoadingSpinner />}
    <FileBrowserBlock
      items={files}
      onPathChange={handlePathChange}
    />
  </>
);
```

### Pattern 2: Search & Filter

```typescript
const [searchTerm, setSearchTerm] = useState("");

const filteredFiles = files.filter(f =>
  f.name.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
  <>
    <input
      type="text"
      placeholder="Search files..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <FileBrowserBlock items={filteredFiles} />
  </>
);
```

### Pattern 3: Bulk Operations with Selection

```typescript
const [selected, setSelected] = useState<FileItem[]>([]);

const deleteSelected = async () => {
  if (!confirm(`Delete ${selected.length} items?`)) return;
  
  await fetch("/api/files/delete", {
    method: "POST",
    body: JSON.stringify({ ids: selected.map(f => f.id) })
  });
  
  setSelected([]);
  // Refresh files...
};

return (
  <>
    {selected.length > 0 && (
      <div className="toolbar">
        <button onClick={deleteSelected}>
          Delete {selected.length} items
        </button>
      </div>
    )}
    
    <FileBrowserBlock
      items={files}
      onSelectionChange={setSelected}
    />
  </>
);
```

### Pattern 4: Restore User Preferences

```typescript
useEffect(() => {
  const savedView = localStorage.getItem("my-file-browser-view");
  const savedSort = localStorage.getItem("my-file-browser-sort");
  
  if (savedView) setViewMode(savedView as FileViewMode);
  if (savedSort) setSortPreference(JSON.parse(savedSort));
}, []);
```

---

## Troubleshooting

### Issue: State Not Updating

**Cause**: Using uncontrolled component but expecting parent to track state.

**Solution**:
```typescript
// ❌ Wrong: Parent doesn't track state
<FileBrowserBlock items={files} onViewModeChange={() => {}} />

// ✅ Correct: Make it controlled
const [view, setView] = useState("grid");
<FileBrowserBlock items={files} viewMode={view} onViewModeChange={setView} />
```

### Issue: Files Not Changing on Path Change

**Cause**: Parent must update `items` prop when path changes.

**Solution**:
```typescript
const handlePathChange = async (newPath: string) => {
  const newFiles = await fetchFilesForPath(newPath);
  setFiles(newFiles);  // ← Update items prop
};
```

### Issue: Sorting Resets on Re-render

**Cause**: This shouldn't happen—component uses localStorage. Check console for errors.

**Solution**: Ensure localStorage isn't disabled and error console is clear.

### Issue: LocalStorage Conflicts

**Cause**: Multiple file browsers use same localStorage keys.

**Solution**: Modify component to accept custom localStorage key prefixes (feature request).

### Issue: Preview Modal Not Opening

**Cause**: File URL might be invalid or viewer not supported.

**Solution**: Check network tab, ensure `url` prop is valid and accessible.

---

## Advanced Tips

### 1. Custom File Icons

Customize icons by file type in your CSS or pass styled components.

### 2. Performance Optimization

For large file lists (1000+), consider:
- Virtual scrolling (not built-in, requires wrapper)
- Pagination
- Lazy loading

### 3. Backend Integration

Always implement:
- Fetch files when path changes
- Handle file operations (move, delete) with API calls
- Persist user preferences (view, sort)

### 4. Accessibility

The component includes semantic HTML. Enhance with:
- Keyboard navigation (arrow keys for items)
- Screen reader labels
- ARIA attributes

---

## Summary for AI Tools

### Key Points to Remember

1. **Core Component**: `FileBrowserBlock` requires `items` array
2. **Data Model**: Every item is a `FileItem` with `id`, `name`, `type`
3. **Two View Modes**: "grid" (tiles) and "list" (rows)
4. **Navigation**: Path changes with `onPathChange` callback
5. **Sorting**: Supports 6 sort fields, persisted to localStorage
6. **Selection**: Returns full items array via `onSelectionChange`
7. **Callbacks**: 8+ event callbacks for full interaction control
8. **Persistence**: View mode and sort settings auto-saved to localStorage

### Quick Integration Checklist

- [ ] Import component and types
- [ ] Prepare `FileItem[]` array
- [ ] Render with `items` prop (minimum)
- [ ] Implement `onPathChange` to load different folders
- [ ] Add `onFileMove` for drag & drop support
- [ ] Connect `onSelectionChange` for bulk operations
- [ ] Use `onSortingChange` to persist preferences

---

**Last Updated**: January 2026
**Version**: 1.0
**Audience**: AI Tools, Developers, Technical Documentation Systems
