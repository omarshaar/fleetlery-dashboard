import * as React from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { EditableInfoCard } from "@/components";

import { Page } from "@/eano/components/page/Page";
import PageHeader from "@/eano/components/widgets/PageHeader";

import { Badge } from "@/eano/design-system/shadcn/badge";
import { Button } from "@/eano/design-system/shadcn/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/eano/design-system/shadcn/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/eano/design-system/shadcn/avatar";

import { useLanguage } from "@/i18n/hooks";

import {
    ArrowLeft,
    CheckCircle2,
    CircleAlert,
    RotateCcw,
    Save,
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

type DraftProfile = {
    id: string;
    avatarUrl: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    bio: string;
    jobTitle: string;
    organizationName: string;
    role: string;
    status: string;
    verified: boolean;
    locale: string;
    timezone: string;
    country: string;
    city: string;
    accentColor: string;
};

const STORAGE_PREFIX = "eano.users.profileEdit.draft";

function storageKey(userId: string) {
    return `${STORAGE_PREFIX}.${userId}`;
}

function safeJsonParse(value: string) {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function loadDraft(userId: string): Partial<DraftProfile> | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = window.localStorage.getItem(storageKey(userId));
        if (!raw) return null;
        const parsed = safeJsonParse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        return parsed as Partial<DraftProfile>;
    } catch {
        return null;
    }
}

function saveDraft(userId: string, draft: DraftProfile) {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(storageKey(userId), JSON.stringify(draft));
    } catch {
        // ignore storage errors
    }
}

function clearDraft(userId: string) {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.removeItem(storageKey(userId));
    } catch {
        // ignore storage errors
    }
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

function normalizeAccentColor(value: unknown) {
    if (typeof value === "string" && value.trim()) return value;
    return "#3b82f6";
}

function colorToRgba(input: string, alpha: number) {
    const c = String(input ?? "").trim();
    if (!c) return `rgba(59, 130, 246, ${alpha})`;

    if (c.startsWith("rgba")) {
        const inner = c.replace("rgba(", "").replace(")", "");
        const parts = inner.split(",").map((p) => p.trim());
        const r = Number(parts[0] ?? 59);
        const g = Number(parts[1] ?? 130);
        const b = Number(parts[2] ?? 246);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    if (c.startsWith("rgb(")) {
        const inner = c.replace("rgb(", "").replace(")", "");
        const parts = inner.split(",").map((p) => p.trim());
        const r = Number(parts[0] ?? 59);
        const g = Number(parts[1] ?? 130);
        const b = Number(parts[2] ?? 246);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    if (c.startsWith("#")) {
        const hex = c.slice(1);
        const normalized = hex.length === 3 ? hex.split("").map((ch) => ch + ch).join("") : hex;
        const r = parseInt(normalized.slice(0, 2), 16);
        const g = parseInt(normalized.slice(2, 4), 16);
        const b = parseInt(normalized.slice(4, 6), 16);
        if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    }

    return `rgba(59, 130, 246, ${alpha})`;
}

function buildDraftFromUser(user: User): DraftProfile {
    return {
        id: user.id,
        avatarUrl: user.avatarUrl,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: String(user.phone ?? ""),
        bio: "",
        jobTitle: String(user.jobTitle ?? ""),
        organizationName: String(user.organization?.name ?? ""),
        role: String(user.role ?? "viewer"),
        status: String(user.status ?? "active"),
        verified: Boolean(user.verified),
        locale: String(user.locale ?? "en"),
        timezone: String(user.timezone ?? "UTC"),
        country: String(user.address?.country ?? ""),
        city: String(user.address?.city ?? ""),
        accentColor: normalizeAccentColor((user as any).accentColor),
    };
}

function applyChanges(
    prev: DraftProfile,
    changed: Record<string, any>,
    options?: {
        booleanKeys?: string[];
    }
): DraftProfile {
    const next = { ...prev };
    const booleanKeys = new Set(options?.booleanKeys ?? []);

    for (const [key, rawValue] of Object.entries(changed)) {
        if (!(key in next)) continue;

        if (key === "avatarUrl") {
            const v = rawValue as any;
            next.avatarUrl = typeof v === "string" ? v : String(v?.src ?? "");
            continue;
        }

        if (booleanKeys.has(key)) {
            if (typeof rawValue === "boolean") {
                (next as any)[key] = rawValue;
            } else {
                (next as any)[key] = String(rawValue) === "true";
            }
            continue;
        }

        (next as any)[key] = typeof rawValue === "string" ? rawValue : String(rawValue ?? "");
    }

    return next;
}

export default function UserProfileEdit() {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const userId = searchParams.get("id");

    const baseUser = React.useMemo(() => {
        const fromQuery = usersMock.find((u) => u.id === userId);
        return (fromQuery ?? usersMock[0]) as User | undefined;
    }, [userId]);

    const [draft, setDraft] = React.useState<DraftProfile | null>(() => {
        if (!baseUser) return null;
        const baseline = buildDraftFromUser(baseUser);
        const stored = loadDraft(baseUser.id);
        return { ...baseline, ...stored };
    });

    const [savedDraft, setSavedDraft] = React.useState<DraftProfile | null>(() => {
        if (!baseUser) return null;
        const baseline = buildDraftFromUser(baseUser);
        const stored = loadDraft(baseUser.id);
        return { ...baseline, ...stored };
    });

    React.useEffect(() => {
        if (!baseUser) {
            setDraft(null);
            setSavedDraft(null);
            return;
        }

        const baseline = buildDraftFromUser(baseUser);
        const stored = loadDraft(baseUser.id);
        const merged = { ...baseline, ...stored };
        setDraft(merged);
        setSavedDraft(merged);
    }, [baseUser]);

    const isDirty = React.useMemo(() => {
        if (!draft || !savedDraft) return false;
        return JSON.stringify(draft) !== JSON.stringify(savedDraft);
    }, [draft, savedDraft]);

    const editableCardStrings = React.useMemo(
        () => ({
            changeImage: t("users.profileEdit.ui.changeImage"),
            selectPlaceholder: t("users.profileEdit.ui.selectPlaceholder"),
            pickColorTitle: t("users.profileEdit.ui.pickColorTitle"),
            pickColorDescription: t("users.profileEdit.ui.pickColorDescription"),
            uploadImageTitle: t("users.profileEdit.ui.uploadImageTitle"),
            uploadImageDescription: t("users.profileEdit.ui.uploadImageDescription"),
            imageFallback: t("users.profileEdit.ui.imageFallback"),
        }),
        [t]
    );

    if (!baseUser || !draft) {
        return (
            <Page className="flex flex-col gap-4">
                <PageHeader
                    title={t("users.profileEdit.pageTitle")}
                    subtitle={t("users.profileEdit.notFound")}
                />
            </Page>
        );
    }

    const roleOptions = [
        { value: "admin", label: t("users.profileEdit.options.role.admin") },
        { value: "manager", label: t("users.profileEdit.options.role.manager") },
        { value: "developer", label: t("users.profileEdit.options.role.developer") },
        { value: "support", label: t("users.profileEdit.options.role.support") },
        { value: "editor", label: t("users.profileEdit.options.role.editor") },
        { value: "viewer", label: t("users.profileEdit.options.role.viewer") },
    ];

    const statusOptions = [
        { value: "active", label: t("common.status.active") },
        { value: "inactive", label: t("common.status.inactive") },
        { value: "pending", label: t("users.profileEdit.options.status.pending") },
    ];

    const localeOptions = [
        { value: "en", label: "English" },
        { value: "ar", label: "العربية" },
        { value: "de", label: "Deutsch" },
    ];

    const timezoneOptions = [
        { value: "UTC", label: "UTC" },
        { value: "Europe/Berlin", label: "Europe/Berlin" },
        { value: "Asia/Riyadh", label: "Asia/Riyadh" },
        { value: "Asia/Dubai", label: "Asia/Dubai" },
    ];

    const verifiedOptions = [
        { value: "true", label: t("common.yes") },
        { value: "false", label: t("common.no") },
    ];

    const onBackToProfile = () => {
        navigate(`/users/profile?id=${encodeURIComponent(baseUser.id)}`);
    };

    const onResetAll = () => {
        clearDraft(baseUser.id);
        const baseline = buildDraftFromUser(baseUser);
        setDraft(baseline);
        setSavedDraft(baseline);
    };

    const onSaveAll = () => {
        saveDraft(baseUser.id, draft);
        setSavedDraft(draft);
    };

    const personalFields = React.useMemo(
        () => [
            {
                key: "avatarUrl",
                label: t("users.profileEdit.fields.avatar"),
                value: draft.avatarUrl,
                type: "image" as const,
            },
            {
                key: "fullName",
                label: t("users.profileEdit.fields.fullName"),
                value: draft.fullName,
                type: "text" as const,
                required: true,
            },
            {
                key: "username",
                label: t("users.profileEdit.fields.username"),
                value: draft.username,
                type: "text" as const,
                required: true,
            },
            {
                key: "bio",
                label: t("users.profileEdit.fields.bio"),
                value: draft.bio,
                type: "textarea" as const,
            },
        ],
        [draft.avatarUrl, draft.bio, draft.fullName, draft.username, t]
    );

    const contactFields = React.useMemo(
        () => [
            {
                key: "email",
                label: t("users.profileEdit.fields.email"),
                value: draft.email,
                type: "email" as const,
                required: true,
            },
            {
                key: "phone",
                label: t("users.profileEdit.fields.phone"),
                value: draft.phone,
                type: "text" as const,
            },
        ],
        [draft.email, draft.phone, t]
    );

    const workFields = React.useMemo(
        () => [
            {
                key: "jobTitle",
                label: t("users.profile.fields.jobTitle"),
                value: draft.jobTitle,
                type: "text" as const,
            },
            {
                key: "organizationName",
                label: t("users.profile.fields.organization"),
                value: draft.organizationName,
                type: "text" as const,
            },
            {
                key: "role",
                label: t("users.columns.role"),
                value: draft.role,
                type: "select" as const,
                options: roleOptions,
            },
            {
                key: "status",
                label: t("users.columns.status"),
                value: draft.status,
                type: "select" as const,
                options: statusOptions,
            },
            {
                key: "verified",
                label: t("users.profileEdit.fields.verified"),
                value: String(draft.verified),
                type: "select" as const,
                options: verifiedOptions,
            },
        ],
        [
            draft.jobTitle,
            draft.organizationName,
            draft.role,
            draft.status,
            draft.verified,
            roleOptions,
            statusOptions,
            t,
            verifiedOptions,
        ]
    );

    const locationFields = React.useMemo(
        () => [
            {
                key: "country",
                label: t("users.profileEdit.fields.country"),
                value: draft.country,
                type: "text" as const,
            },
            {
                key: "city",
                label: t("users.profileEdit.fields.city"),
                value: draft.city,
                type: "text" as const,
            },
            {
                key: "locale",
                label: t("users.profile.fields.locale"),
                value: draft.locale,
                type: "select" as const,
                options: localeOptions,
            },
            {
                key: "timezone",
                label: t("users.profile.fields.timezone"),
                value: draft.timezone,
                type: "select" as const,
                options: timezoneOptions,
            },
        ],
        [draft.city, draft.country, draft.locale, draft.timezone, localeOptions, t, timezoneOptions]
    );

    const preferencesFields = React.useMemo(
        () => [
            {
                key: "accentColor",
                label: t("users.profileEdit.fields.accentColor"),
                value: draft.accentColor,
                type: "color" as const,
            },
        ],
        [draft.accentColor, t]
    );

    const verifiedIcon = draft.verified ? (
        <CheckCircle2 className="h-4 w-4" />
    ) : (
        <XCircle className="h-4 w-4" />
    );

    const accent = normalizeAccentColor(draft.accentColor);

    return (
        <Page className="flex flex-col gap-4">
            <PageHeader
                title={t("users.profileEdit.pageTitle")}
                subtitle={t("users.profileEdit.pageSubtitle")}
            >
                <Button variant="outline" size="sm" onClick={onBackToProfile}>
                    <ArrowLeft className="h-4 w-4" />
                    {t("users.profileEdit.actions.backToProfile")}
                </Button>
                <Button variant="outline" size="sm" onClick={onResetAll} disabled={!isDirty}>
                    <RotateCcw className="h-4 w-4" />
                    {t("users.profileEdit.actions.resetAll")}
                </Button>
                <Button size="sm" onClick={onSaveAll} disabled={!isDirty}>
                    <Save className="h-4 w-4" />
                    {t("users.profileEdit.actions.saveAll")}
                </Button>
            </PageHeader>

            <Card className="relative overflow-hidden">
                <CardHeader className="relative">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="rounded-full p-0.5"
                                style={{ background: `linear-gradient(135deg, ${colorToRgba(accent, 0.9)}, ${colorToRgba(accent, 0.25)})` }}
                            >
                                <Avatar className="size-14 border bg-background">
                                    <AvatarImage src={draft.avatarUrl} alt={draft.fullName} />
                                    <AvatarFallback>{getInitials(draft.fullName)}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="truncate">{draft.fullName}</CardTitle>
                                <CardDescription className="truncate">@{draft.username}</CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{draft.role}</Badge>
                            <Badge variant={draft.status === "active" ? "default" : "secondary"}>
                                {t(`common.status.${draft.status}`, { defaultValue: draft.status })}
                            </Badge>
                            <Badge variant={draft.verified ? "default" : "outline"} className="gap-1">
                                {verifiedIcon}
                                {t("users.profileEdit.fields.verified")}: {draft.verified ? t("common.yes") : t("common.no")}
                            </Badge>
                            {isDirty ? (
                                <Badge variant="destructive" className="gap-1">
                                    <CircleAlert className="h-3.5 w-3.5" />
                                    {t("users.profileEdit.state.unsaved")}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {t("users.profileEdit.state.saved")}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="relative">
                    <div className="space-y-4 lg:col-span-12">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <EditableInfoCard
                                title={t("users.profileEdit.sections.personal")}
                                fields={personalFields}
                                onSave={(changed) =>
                                    setDraft((p) => (p ? applyChanges(p, changed) : p))
                                }
                                strings={editableCardStrings}
                                className="bg-(--background-page)!"
                            />

                            <div className="w-full h-full space-y-3 flex flex-col">
                                <EditableInfoCard
                                    title={t("users.profileEdit.sections.preferences")}
                                    fields={preferencesFields}
                                    onSave={(changed) =>
                                        setDraft((p) => (p ? applyChanges(p, changed) : p))
                                    }
                                    strings={editableCardStrings}
                                    className="bg-(--background-page)! flex-1"
                                />

                                <EditableInfoCard
                                    title={t("users.profileEdit.sections.contact")}
                                    fields={contactFields}
                                    onSave={(changed) =>
                                        setDraft((p) => (p ? applyChanges(p, changed) : p))
                                    }
                                    strings={editableCardStrings}
                                    className="bg-(--background-page)! flex-1"
                                />
                            </div>

                            <EditableInfoCard
                                title={t("users.profileEdit.sections.work")}
                                fields={workFields}
                                onSave={(changed) =>
                                    setDraft((p) =>
                                        p
                                            ? applyChanges(p, changed, {
                                                booleanKeys: ["verified"],
                                            })
                                            : p
                                    )
                                }
                                strings={editableCardStrings}
                                className="bg-(--background-page)!"
                            />

                            <EditableInfoCard
                                title={t("users.profileEdit.sections.location")}
                                fields={locationFields}
                                onSave={(changed) =>
                                    setDraft((p) => (p ? applyChanges(p, changed) : p))
                                }
                                strings={editableCardStrings}
                                className="bg-(--background-page)!"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Page>
    );
}

