# Hooks Documentation

**Purpose**: Comprehensive documentation for custom React hooks used throughout the EANO project.

---

## Table of Contents

1. [useSystemTheme](#usesystemtheme)
2. [useIsMobile](#useismobile)
3. [useSmartBreadcrumbs](#usesmartbreadcrumbs)
4. [Best Practices](#best-practices)
5. [Import & Usage](#import--usage)

---

## useSystemTheme

### Purpose

Detects and listens for system dark/light mode preference using the `prefers-color-scheme` media query.

### Location

```
src/eano/hooks/use-system-theme.ts
```

### Signature

```typescript
function useSystemTheme(): boolean
```

### Return Value

- **`isDark: boolean`** - `true` if system prefers dark mode, `false` for light mode

### How It Works

1. Checks initial system preference via `window.matchMedia("(prefers-color-scheme: dark)")`
2. Sets up listener for system theme changes
3. Updates state when user changes OS theme
4. Cleans up listener on unmount

### Usage

```typescript
import { useSystemTheme } from "@/eano/hooks";

export default function App() {
  const isDark = useSystemTheme();

  return (
    <div className={isDark ? "dark-theme" : "light-theme"}>
      {/* Content */}
    </div>
  );
}
```

### Real-World Example

```typescript
import { useSystemTheme } from "@/eano/hooks";

export function ThemeProvider({ children }) {
  const isDark = useSystemTheme();

  return (
    <div
      style={{
        backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000"
      }}
    >
      {children}
    </div>
  );
}
```

### Behavior

```
User Preference → System detects → Hook triggered → Component re-renders

Example Timeline:
1. User opens app in dark mode
   → isDark = true
   → Renders dark theme

2. User switches OS to light mode
   → Listener catches change
   → isDark = false
   → Renders light theme
```

### Advantages

- ✅ Respects user's system preference
- ✅ Automatically updates on OS theme change
- ✅ No manual theme switching required
- ✅ Lightweight (no external dependencies)
- ✅ Auto cleanup on unmount

### Browser Support

- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

---

## useIsMobile

### Purpose

Detects if the viewport width indicates a mobile device (< 768px breakpoint).

### Location

```
src/eano/hooks/use-mobile.ts
```

### Signature

```typescript
function useIsMobile(): boolean
```

### Return Value

- **`isMobile: boolean`** - `true` if viewport width < 768px, `false` otherwise

### Breakpoint

```typescript
const MOBILE_BREAKPOINT = 768 // pixels

// Mobile: width < 768px
// Desktop: width >= 768px
```

### How It Works

1. Uses `window.matchMedia()` for media query listener
2. Checks initial window width
3. Updates on window resize events
4. Returns boolean value
5. Cleans up listener on unmount

### Usage

```typescript
import { useIsMobile } from "@/eano/hooks";

export default function Navigation() {
  const isMobile = useIsMobile();

  return (
    <nav>
      {isMobile ? (
        <MobileMenu />
      ) : (
        <DesktopMenu />
      )}
    </nav>
  );
}
```

### Real-World Examples

**Example 1: Conditional Rendering**

```typescript
import { useIsMobile } from "@/eano/hooks";

export function Dashboard() {
  const isMobile = useIsMobile();

  return (
    <div className="dashboard">
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

**Example 2: Responsive Grid**

```typescript
const GridComponent = () => {
  const isMobile = useIsMobile();

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)"
      }}
    >
      {/* Items */}
    </div>
  );
};
```

**Example 3: Modal Behavior**

```typescript
const Modal = ({ isOpen, onClose }) => {
  const isMobile = useIsMobile();

  return (
    <dialog
      open={isOpen}
      style={{
        width: isMobile ? "95vw" : "600px",
        position: isMobile ? "fixed" : "absolute"
      }}
    >
      {/* Content */}
    </dialog>
  );
};
```

### Behavior

```
Window Resize → Media Query Listener → State Updates → Re-render

Example Timeline:
1. Page loads with width: 1920px
   → isMobile = false
   → Renders desktop layout

2. User resizes to 500px
   → Listener detects width < 768px
   → isMobile = true
   → Renders mobile layout

3. User resizes back to 1000px
   → Listener detects width >= 768px
   → isMobile = false
   → Renders desktop layout
```

### Advantages

- ✅ Responsive design detection
- ✅ Real-time updates on resize
- ✅ No manual state management
- ✅ Efficient media query approach
- ✅ Clean component logic

### Browser Support

- All modern browsers supporting `window.matchMedia()`
- Chrome 9+
- Firefox 3.5+
- Safari 4+

---

## useSmartBreadcrumbs

### Purpose

Generates breadcrumb navigation dynamically based on current URL and navigation structure from `navMainData`.

### Location

```
src/eano/hooks/useSmartBreadcrumbs.ts
```

### Signature

```typescript
function useSmartBreadcrumbs(): BreadcrumbItemType[]
```

### Return Value

```typescript
type BreadcrumbItemType = {
  label: string        // Display text
  href?: string        // Optional URL
  current?: boolean    // Is this the current page?
}
```

### How It Works

1. Gets current path from `useLocation()` (React Router)
2. Matches path against `navMainData` structure
3. Builds breadcrumb trail with proper hierarchy
4. Marks final item as `current: true`
5. Supports translations (respects language changes)

### Usage

```typescript
import { useSmartBreadcrumbs } from "@/eano/hooks";

export function PageWithBreadcrumbs() {
  const breadcrumbs = useSmartBreadcrumbs();

  return (
    <div>
      <Breadcrumb items={breadcrumbs} />
      <MainContent />
    </div>
  );
}
```

### Real-World Example

```typescript
import { useSmartBreadcrumbs } from "@/eano/hooks";
import Breadcrumb from "@/components/Breadcrumb";

export function Dashboard() {
  const breadcrumbs = useSmartBreadcrumbs();
  // Path: /admin/users/profile
  // Output: [
  //   { label: "Home", href: "/" },
  //   { label: "Admin", href: "/admin" },
  //   { label: "Users", href: "/admin/users" },
  //   { label: "Profile", href: "/admin/users/profile", current: true }
  // ]

  return <Breadcrumb items={breadcrumbs} />;
}
```

### Dependencies

- `useLocation()` - React Router (detects URL changes)
- `navMainData` - Navigation structure from `src/router/navigation-data`
- `useLanguage()` - For translation support

### Advantages

- ✅ Automatic breadcrumb generation
- ✅ No manual URL parsing needed
- ✅ Syncs with navigation structure
- ✅ Supports multi-language UIs
- ✅ Updates on route changes

---

### 1. Hook Initialization

All hooks should be called at top level of component:

```typescript
// ✅ Correct
export function MyComponent() {
  const isDark = useSystemTheme();
  const isMobile = useIsMobile();

  return <div>{/* ... */}</div>;
}

// ❌ Wrong: Inside conditional
export function MyComponent() {
  if (someCondition) {
    const isDark = useSystemTheme(); // Never do this
  }
}
```

### 2. Combining Hooks

You can use multiple hooks together:

```typescript
import { useSystemTheme, useIsMobile } from "@/eano/hooks";

export function ResponsiveTheme() {
  const isDark = useSystemTheme();
  const isMobile = useIsMobile();

  return (
    <div
      className={`
        ${isDark ? "dark" : "light"}
        ${isMobile ? "mobile" : "desktop"}
      `}
    >
      {isMobile && isDark ? (
        <MobileDarkLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

### 3. Performance Optimization

```typescript
// Use callbacks to prevent unnecessary re-renders
import { useMemo, useCallback } from "react";
import { useIsMobile } from "@/eano/hooks";

export function OptimizedComponent() {
  const isMobile = useIsMobile();

  const layout = useMemo(() => {
    return isMobile ? "mobile" : "desktop";
  }, [isMobile]);

  return <div className={layout}>{/* ... */}</div>;
}
```

### 4. Testing with Hooks

```typescript
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "@/eano/hooks";

describe("useIsMobile", () => {
  it("should detect mobile viewport", () => {
    global.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should detect desktop viewport", () => {
    global.innerWidth = 1920;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
```

---

## Import & Usage

### From Index File

```typescript
// Import all hooks
import { useSystemTheme, useIsMobile } from "@/eano/hooks";

// Or import specific hooks
import { useSystemTheme } from "@/eano/hooks/use-system-theme";
import { useIsMobile } from "@/eano/hooks/use-mobile";
```

### In Different Component Types

**Function Component**

```typescript
import { useIsMobile } from "@/eano/hooks";

export default function Page() {
  const isMobile = useIsMobile();
  return <div>{isMobile ? "Mobile" : "Desktop"}</div>;
}
```

**Custom Hook**

```typescript
import { useIsMobile, useSystemTheme } from "@/eano/hooks";

export function useThemeLayout() {
  const isMobile = useIsMobile();
  const isDark = useSystemTheme();

  return {
    layout: isMobile ? "mobile" : "desktop",
    theme: isDark ? "dark" : "light"
  };
}
```

**Context Provider**

```typescript
import { createContext, useContext } from "react";
import { useIsMobile, useSystemTheme } from "@/eano/hooks";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const isMobile = useIsMobile();
  const isDark = useSystemTheme();

  return (
    <ThemeContext.Provider value={{ isMobile, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

---

## Quick Reference

### useSystemTheme

| Aspect | Details |
|--------|---------|
| **Returns** | `boolean` - isDark |
| **Use Case** | Detect system dark/light preference |
| **Updates** | When OS theme changes |
| **Breakpoint** | N/A |
| **Initial Value** | Current system preference |

### useIsMobile

| Aspect | Details |
|--------|---------|
| **Returns** | `boolean` - isMobile |
| **Use Case** | Detect mobile viewport |
| **Updates** | When window resizes |
| **Breakpoint** | 768px |
| **Initial Value** | Current window width |

### useSmartBreadcrumbs

| Aspect | Details |
|--------|---------|
| **Returns** | `BreadcrumbItemType[]` |
| **Use Case** | Auto-generate breadcrumb navigation |
| **Updates** | When route changes |
| **Dependencies** | React Router, navMainData |
| **Translation** | Yes (respects language changes) |

---

## Summary for AI Tools

### All Hooks Overview

| Hook | Returns | Use Case | Updates |
|------|---------|----------|---------|
| **useSystemTheme** | `boolean` | OS dark/light mode detection | OS theme change |
| **useIsMobile** | `boolean` | Responsive layout (< 768px) | Window resize |
| **useSmartBreadcrumbs** | `Breadcrumb[]` | Auto navigation breadcrumbs | Route navigation |

### Quick Integration

```typescript
// Theme
const isDark = useSystemTheme();

// Responsive
const isMobile = useIsMobile();

// Navigation
const breadcrumbs = useSmartBreadcrumbs();
```

### Key Characteristics

- ✅ All hooks use `useMemo` for optimization
- ✅ Auto cleanup on component unmount
- ✅ No external dependencies (except React Router for breadcrumbs)
- ✅ Support for translations (useSmartBreadcrumbs)
- ✅ Real-time updates (listeners/observers)

### For AI Implementations

1. **useSystemTheme** - Use for theme switching logic
2. **useIsMobile** - Use for responsive component layouts
3. **useSmartBreadcrumbs** - Use for navigation breadcrumb trails
4. All return values can be used directly in JSX/logic
5. Combine multiple hooks for complex responsive designs

---

**Last Updated**: January 2026
**Version**: 1.0
**Audience**: AI Tools, Developers
