/**
 * @file AdvancedSearchExample.tsx
 * @description مثال كامل يوضح استخدام ميزات البحث المتقدمة
 */

import { useState } from "react";
import { DataTable } from "../DataTable";
import type { ColumnConfig } from "../types";
import { toast } from "sonner"; // or your toast library

// ============================================================================
// Types & Mock Data
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "Admin",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    role: "User",
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "محمد حسن",
    email: "mohamed@example.com",
    role: "Editor",
    status: "inactive",
    joinDate: "2024-03-10",
  },
  {
    id: "4",
    name: "سارة خالد",
    email: "sara@example.com",
    role: "User",
    status: "active",
    joinDate: "2024-04-05",
  },
];

const columns: ColumnConfig<User>[] = [
  {
    key: "name",
    label: "الاسم",
    type: "text",
    sortable: true,
    searchable: true,
  },
  {
    key: "email",
    label: "البريد الإلكتروني",
    type: "text",
    sortable: true,
    searchable: true,
  },
  {
    key: "role",
    label: "الدور",
    type: "badge",
    sortable: true,
  },
  {
    key: "status",
    label: "الحالة",
    type: "badge",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          value === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {value === "active" ? "نشط" : "غير نشط"}
      </span>
    ),
  },
  {
    key: "joinDate",
    label: "تاريخ الانضمام",
    type: "date",
    sortable: true,
  },
];

// ============================================================================
// Example 1: Local Search with All Features
// ============================================================================

export function LocalSearchExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">بحث محلي متقدم</h2>
      
      <DataTable
        tableId="local-search-users"
        title="جدول المستخدمين"
        description="بحث محلي مع كل الميزات المتقدمة"
        data={mockUsers}
        columns={columns}
        features={{
          search: {
            mode: "local",
            placeholder: "ابحث في الاسم أو البريد...",
            searchColumns: ["name", "email"], // بحث في أعمدة محددة
            showResultsCount: true, // عرض عدد النتائج
            showClearButton: true, // زر المسح
            minChars: 2, // ابدأ البحث بعد حرفين
            caseSensitive: false, // غير حساس لحالة الأحرف
            debounceMs: 300, // تأخير 300ms
          },
          sorting: true,
          pagination: {
            type: "client",
            pageSize: 5,
          },
          selectable: true,
          hideableColumns: true,
        }}
      />
    </div>
  );
}

// ============================================================================
// Example 2: Server Search with Error Handling
// ============================================================================

export function ServerSearchExample() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  // Simulate API call
  const handleServerSearch = async (term: string) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate API call
      const response = await fetch(`/api/users/search?q=${term}`);
      
      if (!response.ok) {
        throw new Error("فشل البحث في السيرفر");
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      // Re-throw to let DataTable handle it
      throw new Error(error.message || "حدث خطأ أثناء البحث");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchError = (error: Error) => {
    toast.error(error.message);
    console.error("Search error:", error);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">بحث من السيرفر</h2>
      
      <DataTable
        tableId="server-search-users"
        title="بحث في قاعدة البيانات"
        description="بحث مباشر من API مع معالجة الأخطاء"
        data={users}
        columns={columns}
        loading={loading}
        features={{
          search: {
            mode: "server",
            placeholder: "ابحث في قاعدة البيانات...",
            onServerSearch: handleServerSearch,
            onSearchError: handleSearchError,
            showClearButton: true,
            minChars: 3, // ابدأ البحث بعد 3 أحرف
            debounceMs: 800, // تأخير 800ms لتقليل الطلبات
          },
          sorting: true,
          pagination: {
            type: "client",
            pageSize: 10,
          },
        }}
      />
    </div>
  );
}

// ============================================================================
// Example 3: Server Search with Abort Controller
// ============================================================================

export function ServerSearchWithAbortExample() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  const handleServerSearch = async (term: string) => {
    setLoading(true);
    
    try {
      // DataTable automatically handles abort controller internally
      // But you can add your own logic here
      
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(term)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">بحث مع إلغاء الطلبات القديمة</h2>
      
      <DataTable
        tableId="abort-search-users"
        title="بحث ذكي"
        description="يلغي الطلبات القديمة تلقائياً عند كتابة جديدة"
        data={users}
        columns={columns}
        loading={loading}
        features={{
          search: {
            mode: "server",
            placeholder: "جرّب الكتابة السريعة...",
            onServerSearch: handleServerSearch,
            showClearButton: true,
            debounceMs: 500,
          },
          sorting: true,
          pagination: {
            type: "client",
            pageSize: 10,
          },
        }}
      />
    </div>
  );
}

// ============================================================================
// Example 4: Comparison - Local vs Server
// ============================================================================

export function LocalVsServerComparison() {
  const [serverUsers, setServerUsers] = useState<User[]>(mockUsers);

  const handleServerSearch = async (term: string) => {
    // Simulate API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const filtered = mockUsers.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    
    setServerUsers(filtered);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Local Search */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">البحث المحلي 🚀</h3>
        <p className="text-sm text-muted-foreground">
          سريع - فوري - يعرض عدد النتائج
        </p>
        
        <DataTable
          tableId="local-comparison"
          title="Local Mode"
          data={mockUsers}
          columns={columns}
          features={{
            search: {
              mode: "local",
              placeholder: "بحث محلي فوري...",
              searchColumns: ["name", "email"],
              showResultsCount: true,
              showClearButton: true,
              debounceMs: 300,
            },
            pagination: {
              type: "client",
              pageSize: 3,
            },
          }}
        />
      </div>

      {/* Server Search */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">بحث السيرفر 🌐</h3>
        <p className="text-sm text-muted-foreground">
          شامل - يبحث في كل البيانات - مع loading state
        </p>
        
        <DataTable
          tableId="server-comparison"
          title="Server Mode"
          data={serverUsers}
          columns={columns}
          features={{
            search: {
              mode: "server",
              placeholder: "بحث في السيرفر...",
              onServerSearch: handleServerSearch,
              showClearButton: true,
              minChars: 2,
              debounceMs: 800,
            },
            pagination: {
              type: "client",
              pageSize: 3,
            },
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: All Examples Combined
// ============================================================================

export function AdvancedSearchShowcase() {
  return (
    <div className="container mx-auto p-6 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">ميزات البحث المتقدمة</h1>
        <p className="text-muted-foreground">
          أمثلة شاملة لكل ميزات البحث في DataTable
        </p>
      </div>

      <LocalSearchExample />
      
      <hr className="my-8" />
      
      <ServerSearchExample />
      
      <hr className="my-8" />
      
      <ServerSearchWithAbortExample />
      
      <hr className="my-8" />
      
      <LocalVsServerComparison />
    </div>
  );
}

export default AdvancedSearchShowcase;
