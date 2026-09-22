import * as React from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { Page } from "@/eano/components/page/Page";
import PageHeader from "@/eano/components/widgets/PageHeader";

import { Button } from "@/eano/design-system/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/eano/design-system/shadcn/card";
import { Badge } from "@/eano/design-system/shadcn/badge";
import { Separator } from "@/eano/design-system/shadcn/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/eano/design-system/shadcn/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/eano/design-system/shadcn/avatar";

import { useLanguage } from "@/i18n/hooks";

import {
  Activity,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  UserRound,
  XCircle,
} from "lucide-react";

import usersMock from "../mock.data/users.mock.json";

type UserStatus = "active" | "inactive" | "pending" | string;

type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string | null;
  avatarUrl: string;
  role?: string;
  status?: UserStatus;
  verified?: boolean;
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

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(items: T[], seed: number) {
  return items[seed % items.length];
}

function getInitials(name: string) {
  const parts = name
    .split(" ")
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const second = parts[1]?.[0] ?? "";
  return `${first}${second}`.toUpperCase();
}

function StatusBadge({ status }: { status?: UserStatus }) {
  const { t } = useLanguage();
  const value = String(status ?? "");

  const variant =
    value === "active" ? "default" : value === "inactive" ? "secondary" : "outline";

  const label = t(`common.status.${value}`, {
    defaultValue: value || t("users.profile.status.unknown", { defaultValue: "Unknown" }),
  });

  return <Badge variant={variant}>{label}</Badge>;
}

export default function UserProfilePage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const data = usersMock as unknown as User[];
  const selectedId = searchParams.get("id");

  const user = React.useMemo(() => {
    return data.find((u) => u.id === selectedId) ?? data[0];
  }, [data, selectedId]);

  if (!user) {
    return (
      <Page>
        <PageHeader
          title={t("users.profile.pageTitle")}
          subtitle={t("users.profile.pageSubtitle")}
        />
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            {t("users.profile.notFound")}
          </CardContent>
        </Card>
      </Page>
    );
  }

  const verifiedLabel = user.verified
    ? t("common.yes")
    : t("common.no");

  const verifiedIcon = user.verified ? (
    <CheckCircle2 className="h-4 w-4" />
  ) : (
    <XCircle className="h-4 w-4" />
  );

  const seed = hashString(user.id);

  const quickStats = React.useMemo(
    () => ({
      sessions30d: 12 + (seed % 48),
      projects: 1 + (seed % 12),
      tickets: seed % 27,
      securityScore: 60 + (seed % 41),
    }),
    [seed]
  );

  const permissions = React.useMemo(() => {
    const role = String(user.role ?? "viewer");
    const base = [
      t("users.profile.permissions.read"),
      t("users.profile.permissions.export"),
    ];

    if (role === "admin") {
      return [
        ...base,
        t("users.profile.permissions.manageUsers"),
        t("users.profile.permissions.manageSettings"),
        t("users.profile.permissions.manageBilling"),
      ];
    }
    if (role === "manager") {
      return [
        ...base,
        t("users.profile.permissions.approve"),
        t("users.profile.permissions.manageContent"),
      ];
    }
    if (role === "developer") {
      return [
        ...base,
        t("users.profile.permissions.apiAccess"),
        t("users.profile.permissions.manageIntegrations"),
      ];
    }
    if (role === "support") {
      return [...base, t("users.profile.permissions.manageTickets")];
    }
    if (role === "editor") {
      return [...base, t("users.profile.permissions.editContent")];
    }

    return base;
  }, [t, user.role]);

  const teams = React.useMemo(() => {
    const prefixes = [
      t("users.profile.teams.team"),
      t("users.profile.teams.squad"),
      t("users.profile.teams.group"),
    ];
    const suffixes = ["A", "B", "C", "D", "E"];
    const count = 1 + (seed % 3);

    return Array.from({ length: count }).map((_, index) => {
      const s = seed + index * 19;
      const name = `${pick(prefixes, s)} ${pick(suffixes, s + 7)}`;
      const daysAgo = 30 + (s % 780);
      const since = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      return {
        id: `${user.id}-team-${index}`,
        name,
        since: since.toISOString(),
      };
    });
  }, [seed, t, user.id]);

  const activityItems = React.useMemo(() => {
    const types = [
      {
        icon: <Activity className="h-4 w-4" />,
        title: t("users.profile.activity.login"),
      },
      {
        icon: <KeyRound className="h-4 w-4" />,
        title: t("users.profile.activity.password"),
      },
      {
        icon: <Shield className="h-4 w-4" />,
        title: t("users.profile.activity.security"),
      },
    ];

    const now = Date.now();
    return Array.from({ length: 7 }).map((_, index) => {
      const s = seed + index * 13;
      const item = pick(types, s);
      const hoursAgo = 4 + (s % 240);
      const when = new Date(now - hoursAgo * 60 * 60 * 1000);
      return {
        id: `${user.id}-activity-${index}`,
        icon: item.icon,
        title: item.title,
        date: when.toISOString(),
      };
    });
  }, [seed, t, user.id]);

  const loginHistory = React.useMemo(() => {
    const locations = [
      t("users.profile.login.locations.dubai"),
      t("users.profile.login.locations.riyadh"),
      t("users.profile.login.locations.berlin"),
      t("users.profile.login.locations.paris"),
      t("users.profile.login.locations.london"),
      t("users.profile.login.locations.newYork"),
    ];
    const methods = [
      t("users.profile.login.methods.password"),
      t("users.profile.login.methods.sso"),
      t("users.profile.login.methods.magicLink"),
    ];
    const devices = [
      t("users.profile.login.devices.web"),
      t("users.profile.login.devices.mobile"),
      t("users.profile.login.devices.desktop"),
    ];

    const now = Date.now();
    return Array.from({ length: 6 }).map((_, index) => {
      const s = seed + index * 17;
      const daysAgo = 1 + (s % 30);
      const when = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      const ip = `192.168.${s % 255}.${(s * 7) % 255}`;

      return {
        id: `${user.id}-login-${index}`,
        date: when.toISOString(),
        location: pick(locations, s),
        method: pick(methods, s + 3),
        device: pick(devices, s + 9),
        ip,
        success: s % 9 !== 0,
      };
    });
  }, [seed, t, user.id]);

  return (
    <Page className="flex flex-col gap-1">
      <PageHeader
        title={t("users.profile.pageTitle")}
        subtitle={t("users.profile.pageSubtitle")}
      >
        <Button variant="outline" size="sm" onClick={() => console.log("Reset password")}
        >
          <Lock className="h-4 w-4" />
          {t("users.profile.actions.resetPassword")}
        </Button>
        <Button
          size="sm"
          onClick={() =>
            navigate(`/users/profile/edit?id=${encodeURIComponent(user.id)}`)
          }
        >
          <UserRound className="h-4 w-4" />
          {t("users.profile.actions.edit")}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Left summary */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <Avatar className="size-14">
                <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <CardTitle className="truncate">{user.fullName}</CardTitle>
                <CardDescription className="truncate">@{user.username}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{String(user.role ?? "")}</Badge>
              <StatusBadge status={user.status} />
              <Badge variant={user.verified ? "default" : "outline"} className="gap-1">
                {verifiedIcon}
                {t("users.profile.verified", { defaultValue: "Verified" })}: {verifiedLabel}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-foreground">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-foreground">{user.phone}</span>
                </div>
              )}
              {(user.address?.city || user.address?.country) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-foreground">
                    {user.address?.city ?? ""}
                    {user.address?.city && user.address?.country ? ", " : ""}
                    {user.address?.country ?? ""}
                  </span>
                </div>
              )}
              {user.organization?.name && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="text-foreground">{user.organization.name}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("users.profile.createdAt")}
                </div>
                <div className="mt-1 text-sm font-medium">{formatDate(user.createdAt) || "—"}</div>
              </div>

              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t("users.profile.lastLoginAt")}
                </div>
                <div className="mt-1 text-sm font-medium">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : "—"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right details */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>{t("users.profile.detailsTitle")}</CardTitle>
            <CardDescription>{t("users.profile.detailsSubtitle")}</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">
                  <UserRound className="h-4 w-4" />
                  {t("users.profile.tabs.account")}
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4" />
                  {t("users.profile.tabs.security")}
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <Globe className="h-4 w-4" />
                  {t("users.profile.tabs.preferences")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">{t("users.profile.fields.jobTitle")}</div>
                    <div className="mt-1 text-sm font-medium">
                      {user.jobTitle || t("users.profile.fields.empty")}
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">{t("users.profile.fields.organization")}</div>
                    <div className="mt-1 text-sm font-medium">
                      {user.organization?.name || t("users.profile.fields.empty")}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground">{t("users.profile.fields.userId")}</div>
                  <div className="mt-1 text-sm font-mono break-all">{user.id}</div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-4 space-y-3">
                <div className="rounded-lg border p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{t("users.profile.security.twoFactor")}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("users.profile.security.twoFactorSubtitle")}
                    </div>
                  </div>

                  <Badge variant={user.twoFactorEnabled ? "default" : "secondary"}>
                    {user.twoFactorEnabled ? t("common.enabled") : t("common.disabled")}
                  </Badge>
                </div>

                <div className="rounded-lg border p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{t("users.profile.security.emailVerified")}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("users.profile.security.emailVerifiedSubtitle")}
                    </div>
                  </div>

                  <Badge variant={user.verified ? "default" : "outline"}>
                    {user.verified ? t("common.verified") : t("common.unverified")}
                  </Badge>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">{t("users.profile.fields.locale")}</div>
                    <div className="mt-1 text-sm font-medium">{user.locale || "—"}</div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">{t("users.profile.fields.timezone")}</div>
                    <div className="mt-1 text-sm font-medium">{user.timezone || "—"}</div>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
                  {t("users.profile.preferencesHint")}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Additional Profile Sections */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>{t("users.profile.sections.overview")}</CardTitle>
            <CardDescription>{t("users.profile.sections.overviewSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="text-xs text-muted-foreground">{t("users.profile.stats.sessions30d")}</div>
                <div className="mt-1 text-2xl font-semibold">{quickStats.sessions30d}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="text-xs text-muted-foreground">{t("users.profile.stats.projects")}</div>
                <div className="mt-1 text-2xl font-semibold">{quickStats.projects}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="text-xs text-muted-foreground">{t("users.profile.stats.tickets")}</div>
                <div className="mt-1 text-2xl font-semibold">{quickStats.tickets}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="text-xs text-muted-foreground">{t("users.profile.security.securityScore")}</div>
                <div className="mt-1 text-2xl font-semibold">{quickStats.securityScore}%</div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium">{t("users.profile.teams.title")}</div>
              <div className="mt-2 space-y-2">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{team.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t("users.profile.teams.memberSince")} {formatDate(team.since)}
                      </div>
                    </div>
                    <Badge variant="secondary">{t("users.profile.teams.member")}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>{t("users.profile.activity.title")}</CardTitle>
            <CardDescription>{t("users.profile.sections.activitySubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="mt-0.5 rounded-md border bg-muted/30 p-2 text-muted-foreground">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(item.date)}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-12">
          <CardHeader>
            <CardTitle>{t("users.profile.login.title")}</CardTitle>
            <CardDescription>{t("users.profile.sections.loginSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {loginHistory.map((item) => (
              <div key={item.id} className="rounded-lg border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">
                    {item.success ? t("users.profile.login.success") : t("users.profile.login.failed")}
                  </div>
                  <Badge variant={item.success ? "default" : "destructive"}>{item.device}</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <div>{formatDate(item.date)}</div>
                  <div>
                    {t("users.profile.login.location")}: {item.location}
                  </div>
                  <div>
                    {t("users.profile.login.method")}: {item.method}
                  </div>
                  <div>
                    {t("users.profile.login.ip")}: {item.ip}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-12">
          <CardHeader>
            <CardTitle>{t("users.profile.permissions.title")}</CardTitle>
            <CardDescription>{t("users.profile.sections.permissionsSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {permissions.map((p) => (
                <Badge key={p} variant="secondary">
                  {p}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
