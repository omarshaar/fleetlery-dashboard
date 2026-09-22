import * as React from "react";

import { Page } from "@/eano/components/page/Page";
import PageHeader from "@/eano/components/widgets/PageHeader";
import { DataTable, type ColumnConfig } from "@/eano/data-table-builder";
import { CellBadge } from "@/eano/data-table-builder/components/cells";
import { Button } from "@/eano/design-system/shadcn/button";
import { useLanguage } from "@/i18n/hooks";

import { Download, Plus } from "lucide-react";

import usersMock from "./mock.data/users.mock.json";

type UserStatus = "active" | "inactive" | "pending" | string;
type UserRole =
  | "admin"
  | "manager"
  | "developer"
  | "editor"
  | "support"
  | "auditor"
  | "viewer"
  | string;

type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string | null;
  avatarUrl: string;
  role: UserRole;
  status: UserStatus;
  verified: boolean;
  twoFactorEnabled?: boolean;
  locale?: string;
  timezone?: string;
  createdAt?: string;
  lastLoginAt?: string | null;
  organization?: {
    id: string;
    name: string;
  };
  jobTitle?: string;
  address?: {
    country?: string;
    city?: string;
  };
};

function formatDate(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString();
}

export default function Users() {
  const { t } = useLanguage();

  const data = usersMock as unknown as User[];

  const columns = React.useMemo<ColumnConfig<User>[]>(
    () => [
      {
        key: "avatarUrl",
        label: t("users.columns.avatar", { defaultValue: "Avatar" }),
        type: "image",
        minWidth: 100,
      },
      {
        key: "fullName",
        label: t("users.columns.fullName", { defaultValue: "Name" }),
        type: "text",
        sortable: true,
        searchable: true,
        minWidth: 220,
      },
      {
        key: "username",
        label: t("users.columns.username", { defaultValue: "Username" }),
        type: "text",
        sortable: true,
        searchable: true,
        minWidth: 180,
        hideable: true,
      },
      {
        key: "email",
        label: t("users.columns.email", { defaultValue: "Email" }),
        type: "text",
        sortable: true,
        searchable: true,
        minWidth: 240,
      },
      {
        key: "organization.name",
        label: t("users.columns.organization", { defaultValue: "Organization" }),
        type: "text",
        sortable: true,
        searchable: true,
        minWidth: 180,
        hideable: true,
      },
      {
        key: "role",
        label: t("users.columns.role", { defaultValue: "Role" }),
        type: "custom",
        sortable: true,
        minWidth: 120,
        render: (value) => {
          const role = String(value ?? "");
          const variant =
            role === "admin"
              ? "destructive"
              : role === "manager"
                ? "default"
                : "secondary";

          return <CellBadge text={role} variant={variant} />;
        },
      },
      {
        key: "status",
        label: t("users.columns.status", { defaultValue: "Status" }),
        type: "custom",
        sortable: true,
        minWidth: 120,
        render: (value) => {
          const status = String(value ?? "");
          const badgeVariant =
            status === "active"
              ? "default"
              : status === "inactive"
                ? "secondary"
                : status === "pending"
                  ? "outline"
                  : "outline";

          const label = t(`common.status.${status}`, {
            defaultValue: status,
          });

          return <CellBadge text={label} variant={badgeVariant} />;
        },
      },
      {
        key: "verified",
        label: t("users.columns.verified", { defaultValue: "Verified" }),
        type: "custom",
        sortable: true,
        minWidth: 110,
        hideable: true,
        render: (value) => {
          const isVerified = Boolean(value);
          return (
            <CellBadge
              text={isVerified ? t("common.yes", { defaultValue: "Yes" }) : t("common.no", { defaultValue: "No" })}
              variant={isVerified ? "default" : "secondary"}
            />
          );
        },
      },
      {
        key: "createdAt",
        label: t("users.columns.createdAt", { defaultValue: "Created" }),
        type: "date",
        sortable: true,
        minWidth: 120,
        hideable: true,
        render: (value) => formatDate(value),
      },
      {
        key: "lastLoginAt",
        label: t("users.columns.lastLoginAt", { defaultValue: "Last Login" }),
        type: "date",
        sortable: true,
        minWidth: 130,
        hideable: true,
        render: (value) => (value ? formatDate(value) : "—"),
      },
    ],
    [t]
  );

  return (
    <Page>
      <PageHeader
        className="mb-4"
        title={t("navigation.users")}
        subtitle={t("users.pageSubtitle", {
          defaultValue: "Browse and manage users (mock data).",
        })}
      >
        <Button
          size="sm"
          variant="outline"
          onClick={() => console.log("Export users")}
        >
          <Download className="h-4 w-4" />
          {t("users.actions.export", { defaultValue: "Export" })}
        </Button>

        <Button size="sm" onClick={() => console.log("Add user")}
        >
          <Plus className="h-4 w-4" />
          {t("users.actions.add", { defaultValue: "Add User" })}
        </Button>
      </PageHeader>

      <div className="w-full h-full">
        <DataTable<User>
          tableId="users"
          data={data}
          columns={columns}
          emptyMessage={t("users.empty", { defaultValue: "No users found." })}
          className="h-full"
          features={{
            search: {
              mode: "local",
              placeholder: t("users.searchPlaceholder", {
                defaultValue: "Search users...",
              }),
              searchColumns: [
                "fullName",
                "username",
                "email",
                "phone",
                "organization.name",
                "jobTitle",
              ],
              showClearButton: true,
              showResultsCount: true,
              debounceMs: 250,
            },
            sorting: true,
            pagination: {
              type: "client",
              pageSize: 15,
            },
            hideableColumns: true,
          }}
        />
      </div>
    </Page>
  );
}
