/**
 * ============================================================================
 * @file PageHeaderExample.tsx
 * @description Example page demonstrating PageHeader component usage
 * ============================================================================
 */

import { PageHeader, Button } from "@/components";
import { 
  Download, 
  Filter, 
  Plus, 
  Upload,
  RefreshCw 
} from "lucide-react";

export default function PageHeaderExample() {
  return (
    <div className="p-6 space-y-12">
      
      {/* Example 1: Auto-detect title from router */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
          Example 1: Auto Title + Actions
        </h2>
        <div className="border rounded-lg p-6 bg-card">
          <PageHeader>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </PageHeader>
          
          <div className="mt-6 text-sm text-muted-foreground">
            Page content goes here...
          </div>
        </div>
      </section>

      {/* Example 2: Manual title with subtitle */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
          Example 2: Manual Title + Subtitle
        </h2>
        <div className="border rounded-lg p-6 bg-card">
          <PageHeader 
            title="Products Management"
            subtitle="Manage your product inventory and pricing"
          >
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </PageHeader>
          
          <div className="mt-6 text-sm text-muted-foreground">
            Product list table would go here...
          </div>
        </div>
      </section>

      {/* Example 3: Simple title only */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
          Example 3: Simple Title Only
        </h2>
        <div className="border rounded-lg p-6 bg-card">
          <PageHeader title="Dashboard Overview" />
          
          <div className="mt-6 text-sm text-muted-foreground">
            Dashboard widgets would go here...
          </div>
        </div>
      </section>

      {/* Example 4: Title with single action */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
          Example 4: Single Action Button
        </h2>
        <div className="border rounded-lg p-6 bg-card">
          <PageHeader 
            title="Settings"
            subtitle="Configure your application preferences"
          >
            <Button size="sm" variant="outline">
              <RefreshCw className="h-4 w-4" />
              Reset to Default
            </Button>
          </PageHeader>
          
          <div className="mt-6 text-sm text-muted-foreground">
            Settings form would go here...
          </div>
        </div>
      </section>

      {/* Example 5: Arabic (RTL) */}
      <section dir="rtl">
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
          مثال 5: دعم اللغة العربية
        </h2>
        <div className="border rounded-lg p-6 bg-card">
          <PageHeader 
            title="إدارة المنتجات"
            subtitle="إدارة المخزون والأسعار الخاصة بك"
          >
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4" />
              تصفية
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              إضافة منتج
            </Button>
          </PageHeader>
          
          <div className="mt-6 text-sm text-muted-foreground">
            محتوى الصفحة...
          </div>
        </div>
      </section>

    </div>
  );
}
