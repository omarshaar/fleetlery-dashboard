"use client";

/**
 * ============================================================================
 * @file PageHeader.tsx
 * @description Page header component for consistent page titles and actions
 * 
 * Features:
 * - Displays page title (manual or auto from router)
 * - Accepts children for action buttons (export, filter, etc.)
 * - Flex layout with space-between
 * - RTL/LTR support
 * 
 * @version 1.0.0
 * @author Omar Shaar
 * @since 2026
 * ============================================================================
 */

import type { ReactNode } from "react";
import { useLocation, matchPath } from "react-router-dom";
import routes from "@/router";

interface PageHeaderProps {
  /**
   * Page title - if not provided, will auto-detect from router
   */
  title?: string;
  
  /**
   * Optional subtitle or description
   */
  subtitle?: string;
  
  /**
   * Action buttons or elements (export, filter, add, etc.)
   */
  children?: ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * PageHeader component
 * 
 * @example
 * // With manual title
 * <PageHeader title="Products" subtitle="Manage your inventory">
 *   <Button>Add Product</Button>
 *   <Button variant="outline">Export</Button>
 * </PageHeader>
 * 
 * @example
 * // Auto-detect title from router
 * <PageHeader>
 *   <Button>Add New</Button>
 * </PageHeader>
 */
export function PageHeader({ 
  title, 
  subtitle, 
  children, 
  className = "" 
}: PageHeaderProps) {
  const location = useLocation();
  
  // Auto-detect title from router if not provided
  const pageTitle = title || getPageTitleFromRouter(location.pathname);

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      {/* Title Section */}
      <div className="flex-1 w-max">
        <h1 className="text-2xl! m-0! font-bold tracking-tight text-foreground">
          {pageTitle}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions Section */}
      {children && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 w-max">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to get page title from router configuration
 */
function getPageTitleFromRouter(pathname: string): string {
  // Find matching route
  const route = routes.find((r) => {
    return matchPath(r.path, pathname);
  });

  // Return route title or fallback
  return route?.title || "Page";
}

export default PageHeader;
